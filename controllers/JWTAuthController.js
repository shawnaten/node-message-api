const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const UUID = require('uuid');
const UserModel = require('../models/UserModel');
const Boom = require('boom');

const MockDB = UserModel.MockDB;

// TODO should be stored differently
exports.secret = 'vghLJOFXnJjBk9GTYwLZ4XhVZJRYy9deZzhcWBg3CRFScUZ5fK73fqpzH5tkxvC';

// validates JWT in requests
// do your checks to see if the person is valid
exports.validate = function(decoded, request, callback) {
  var user;

  UserModel.findOne({ _id: decoded.sub }, findUser);

  function findUser(err, result) {
    user = result;

    if (err || user === null) return callback(null, false);

    for(var i=0; i < user.tokens.length; i++)
      if (user.tokens[i].jti == decoded.jti)
        return callback(null, true);
    return callback(null, false);
  }
};

exports.testHandler = function(request, reply) {
  return reply('token auth success').header("Authorization", request.headers.authorization);
};


// handles generating JWT when user access /auth route
// register token to device so they can be individually revoked
exports.authHandler = function (request, reply) {
  var credentials = request.auth.credentials;

  var deviceName = request.query.device_name;
  var jti = UUID.v4();
  var user;

  UserModel.findOne({ _id: credentials.id }, findUser);

  function findUser(err, result) {
    user = result;

    if (err || user === null) return reply(Boom.badImplementation('db error'));

    user.tokens.push({
      device_name: deviceName,
      jti: jti
    });

    user.save(saveUser);
  }

  function saveUser(err) {
    if (err) return reply(Boom.badImplementation('db error'));

    var payload = {
      iss: Date.now(),
      exp: Date.now()+365*24*60*60*1000, // expires after 1 year
      sub: credentials.id,
      aud: credentials.id,
      jti: jti
    };

    var token = JWT.sign(payload, exports.secret);
    reply( {'access_token': token } );
  }
};
