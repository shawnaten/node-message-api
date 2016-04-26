const TokenModel = require('../models/TokenModel');
const UserModel = require('../models/UserModel');
const Boom = require('boom');
const ChatModel = require('../models/ChatModel');

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const ENV = process.env.ENV;
const BASE_URL = process.env.BASE_URL;

const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

exports.createHandler = function (request, reply) {
  var savedUser;

  var newUserInfo = {
    name: request.query.name,
    nick: request.query.nick,
    email: request.query.email,
    password: request.query.password
  };

  UserModel.findOne({ email: newUserInfo.email }, findUser);

  function findUser(err, user) {
    savedUser = user;

    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else if (user !== null)
      if (user.verified) return reply(Boom.badRequest({ message: 'account already exists' }));
      else UserModel.remove({ email: user.email }, deleteUser);
    else UserModel.create(newUserInfo, createUser);
  }

  function deleteUser(err) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else UserModel.create(newUserInfo, createUser);
  }

  function createUser(err, user) {
    savedUser = user;

    if (err || user === null) return reply(Boom.badImplementation(err));
    else TokenModel.create({ _userId: user._id }, createToken);
  }

  function createToken(err, token) {
    if (err || token === null) return reply(Boom.badImplementation({ message: 'db error' }));
    else {
      var emailData = {
        from: 'Node API <nodeapi@' + MAILGUN_DOMAIN + '>',
        to: savedUser.email,
        subject: 'Account Verification',
        text: 'Follow this link: ' + BASE_URL + '/user/verify?token=' + token._id + ' to verify account.'
      };
      mailgun.messages().send(emailData, sendEmail);
    }
  }

  function sendEmail(err, body) {
    if (err || body === null) return reply(Boom.badImplementation({ message: 'email send error' }));
    else return reply({ message: 'account created' });
  }
}

exports.verifyHandler = function (request, reply) {
  var savedToken;

  if (request.query.token === null) reply(boom.badRequest({ message: 'invalid token' }));

  TokenModel.findOne({ _id: request.query.token }, findToken);

  function findToken(err, token) {
    savedToken = token;

    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    if (token === null) return reply(Boom.badRequest({ message: 'invalid token' }));
    else UserModel.findOne({ _id: token._userId }, findUser);
  }

  function findUser(err, user) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else if (user === null) return reply(Boom.badRequest({ message: 'invalid token' }));
    else {
      user.verified = true;
      user.save(saveUser);
    }
  }

  function saveUser(err) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else TokenModel.remove({ _id: savedToken._id }, removeToken);
  }

  function removeToken(err) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else reply({ message: 'account verified' });
  }
}

exports.deleteHandler = function (request, reply) {
  var savedUser;

  UserModel.findOne({ _id: request.auth.credentials.id }, findUser);

  function findUser(err, user) {
    savedUser = user;

    if (err || user === null) return reply(Boom.badImplementation(err));
    else UserModel.remove({ _id: user._id }, deleteUser);
  }

  function deleteUser(err) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    ChatModel.remove({ _users: savedUser._id }, deleteChats);
  }

  function deleteChats(err) {
    if (err) return reply(Boom.badImplementation({ message: 'db error' }));
    else return reply({ message: 'account deleted' });
  }
}
