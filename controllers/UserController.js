const BankUserModel = require('../models/BankUserModel');
const TokenModel = require('../models/TokenModel');
const UserModel = require('../models/UserModel');
const Boom = require('boom');
const ChatModel = require('../models/ChatModel');

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const env = process.env.ENV;
const BASE_URL = process.env.BASE_URL;

const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

var emailData = {
  from: 'Node API <nodeapi@' + domain + '>',
};

exports.createHandler = function (request, reply) {
  var bankUser;
  var user;
  var token;

  var postQuery = request.query;

  var bankQuery = {
    first: postQuery.first,
    middle: postQuery.middle,
    last: postQuery.last,
    email: postQuery.email
  };

  BankUserModel.findOne(bankQuery, findBankUser);

  function findBankUser(err, result) {
    bankUser = result;

    if (err) 
      return reply(Boom.badImplementation('bank db error'));
    else if (bankUser === null)
      return reply(Boom.badRequest('bank customer not found'));
    else	
      UserModel.findOne({ _bankId: bankUser._id }, findUser);
  }

  function findUser(err, result) {
    user = result;

    if (err) 
      return reply(Boom.badImplementation('db error'));
    else if (user !== null)
      if (user.verified) 
        return reply(Boom.badRequest('account already exists'));
      else
        UserModel.remove({ _bankId: user._bankId }, deleteUser);
    else {
      UserModel.create({ _bankId: bankUser._id, password: postQuery.password }, createUser);
    }
  }

  function deleteUser(err) {
    if (err) 
      return reply(Boom.badImplementation('db error'));
    else
      UserModel.create({ _bankId: bankUser._id, password: postQuery.password },
          createUser);
  }

  function createUser(err, result) {
    user = result;

    if (err) 
      return reply(Boom.badImplementation('db error'));
    else if (user !== null)
      TokenModel.create({ _userId: user._id }, createToken);
  }

  function createToken(err, result) {
    token = result;
    if (err)
      return reply(Boom.badImplementation('db error'));
    else if (token !== null) {
      emailData.to = bankUser.email;
      emailData.subject = 'Account Verification';
      emailData.text = 'Follow this link: ' + BASE_URL + '/user/verify?token=' + token._id + ' to verify account.';
      mailgun.messages().send(emailData, sendEmail);
    }
  }

  function sendEmail(err, body) {
    if (err)
      return reply(Boom.badImplementation('email send error'));
    else if (env == 'dev')
      return reply({ token: token._id });
    else
      return reply('Account created; verifcation email sent.');
  }
}

exports.verifyHandler = function (request, reply) {
  var tokenId = request.query.token;
  var token;
  var user;

  if (tokenId === null) reply(boom.badRequest('token not found'));

  TokenModel.findOne({ _id: tokenId }, findToken);

  function findToken(err, result) {
    token = result;

    if (err)
      return reply(Boom.badImplementation('db error'));
    if (token === null)
      return reply(boom.badRequest('token not found'));
    else
      UserModel.findOne({ _id: token._userId }, findUser);
  }

  function findUser(err, result) {
    user = result;

    if (err) 
      return reply(Boom.badImplementation('db error'));
    else if (user === null)
      return reply(Boom.badImplementation('no user found'));
    else {
      user.verified = true;
      user.save(saveUser);
    }
  }

  function saveUser(err) {
    if (err)
      return reply(Boom.badImplementation('db error'));
    else
      TokenModel.remove({ _id: token._id }, removeToken);
  }

  function removeToken(err) {
    if (err)
      return reply(Boom.badImplementation('db error'));
    else
      reply('account verified');
  }
}

exports.deleteHandler = function (request, reply) {
  var credentials = request.auth.credentials;
  var user;

  UserModel.findOne({ email: credentials.email }, findUser);

  function findUser(err, result) {
    user = result;

    if (err) return reply(Boom.badImplementation('db error'));
    else if (user === null) return reply(Boom.badRequest('no user found'));
    else UserModel.remove({ _id: user._id }, deleteUser);
  }

  function deleteUser(err) {
    if (err) return reply(Boom.badImplementation('db error'));
    ChatModel.remove({ _users: user._id }, deleteChats);
  }

  function deleteChats(err) {
    if (err) return reply(Boom.badImplementation('db error'));
    else return reply('user deleted');
  }
}
