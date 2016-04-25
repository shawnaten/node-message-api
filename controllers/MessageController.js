const UserModel = require('../models/UserModel');
const BankUserModel = require('../models/BankUserModel');
const ChatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel');
const Boom = require('boom');
const Util = require('../Util');

exports.postHandler = function (request, reply) {
  var credentials = request.auth.credentials;
  var userId = credentials.sub;
  var chatId = request.query.id;
  var text = request.query.text;

  var chat;

  ChatModel.findOne({ _id: chatId }, findChat);

  function findChat(err, result) {
    if (err || result === null)
      return reply(Boom.badImplementation('db error'));

    chat = result;

    if (chat._users.indexOf(userId) == -1)
      return reply(Boom.unauthorized('user not in chat'));
    MessageModel.create({ _chatId: chatId, _userId: userId, text: text }, createMessage);
  }

  function createMessage(err, message) {
    if (err || message === null)
      return reply(Boom.badImplementation('db error'));
    return reply({ id: message._id });
  }
}

exports.listHandler = function(request, reply) {
  var credentials = request.auth.credentials;
  var userId = credentials.sub;
  var chatId = request.query.id;

  ChatModel.findOne({ _id: chatId, _users: userId }, findChat);

  function findChat(err, chat) {
    if (err) return reply(Boom.badImplementation('db error'));
    else if (chat === null) return reply(Boom.badRequest('no chat found for user'));

    MessageModel.find({ _chatId: chatId }, findMessages);
  }

  function findMessages(err, messages) {
    if (err) return reply(Boom.badImplementation('db error'));

    return reply({ messages: messages });
  }
}
