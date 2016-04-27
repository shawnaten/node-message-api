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
    var tokens;
    user = result;

    if (err) return reply(Boom.badImplementation(err));
    else if (user === null)
      return reply(Boom.badImplementation('user was null'));

    tokens = user.tokens;
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].deviceName == deviceName)
        return reply(Boom.badRequest('device name already used'));
    }

    user.tokens.push({
      deviceName: deviceName,
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

exports.listHandler = function (request, reply) {
  UserModel.findOne({ _id: request.auth.credentials.sub }, findUser);

  function findUser(err, user) {
    var devices = [];

    if (err) return reply(Boom.badImplementation(err));
    else if (user === null)
      return reply(Boom.badImplementation('user was null'));

    for (var i=0; i < user.tokens.length; i++)
      devices.push(user.tokens[i].deviceName);
    return reply({ tokens: devices });
  }
};

exports.removeHandler = function (request, reply) {
  var deviceName = request.query.device_name;

  UserModel.findOne({ _id: request.auth.credentials.sub }, findUser);

  function findUser(err, user) {
    var i;
    var tokens;

    if (err) return reply(Boom.badImplementation(err));
    else if (user === null)
      return reply(Boom.badImplementation('user was null'));

    tokens = user.tokens;
    for (i=0; i < tokens.length; i++) {
      console.log("++"+tokens[i].deviceName);
      console.log("--"+deviceName);
      if (tokens[i].deviceName == deviceName)
        break;
    }

    if (i == tokens.length)
      return reply(Boom.badRequest({ message: 'device not found' }))

    tokens.splice(i, 1);
    user.tokens = tokens;
    user.save(saveUser);
  }

  function saveUser(err) {
    if (err) return reply(Boom.badImplementation(err));
    return reply({ message: 'device removed' });
  }
};
