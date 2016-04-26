const UserModel = require('../models/UserModel');
const KeyModel = require('../models/KeyModel');
const Boom = require('boom');

exports.addHandler = function (request, reply) {

  if (request.query.key === null)
    return reply(Boom.badRequest({ message: 'must provide key' }));

  KeyModel.findOne({ _userId: request.auth.credentials.sub }, findKey);

  function findKey(err, key) {
    if (err) return reply(Boom.badImplementation(err));
    if (key !== null) key.key = request.query.key;
    else key = new KeyModel({ _userId: request.auth.credentials.sub, key: request.query.key});
    key.save(saveKey);
  }

  function saveKey(err) {
    if (err) return reply(Boom.badImplementation(err));
    return reply({ message: 'key added' });
  }
  
}

exports.getHandler = function (request, reply) {

  UserModel.findOne({ email: request.query.email }, findUser);

  function findUser(err, user) {
    if (err) console.log(err);
    if (err || user === null)
      return reply(Boom.badRequest({ message: 'no user found' }));
    KeyModel.findOne({ _userId: user._id }, findKey);
  }

  function findKey(err, key) {
    if (err) return reply(Boom.badImplementation(err));
    if (key === null) return reply({ key: null });
    return reply({ key: key.key });
  }
  
}
