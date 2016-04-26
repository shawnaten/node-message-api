const UserModel = require('../models/UserModel');
const DirectMessageModel = require('../models/DirectMessageModel');
const Boom = require('boom');
const Util = require('../Util');

exports.sendHandler = function (request, reply) {
  var savedUser;

  UserModel.findOne({ email: request.query.email }, findUser);

  function findUser(err, user) {
    if (err) console.log(err);
    if (err || user === null) return reply(Boom.badRequest({ message: 'no user found' }));
    DirectMessageModel.create({ _userId: [ request.auth.credentials.sub ], text: request.query.text }, createMessage);
  }

  function createMessage(err, message) {
    if (err) console.log(err);
    if (err || message === null) return reply(Boom.badRequest({ message: 'unable to send message' }));
    reply({ message: 'message sent' });
  }
}

exports.listHandler = function(request, reply) {
  var savedMessages;

  DirectMessageModel.find({ _userId: request.auth.credentials.sub }, findMessages);

  function findMessages(err, messages) {
    var messageIds = [];

    if (err) console.log(err);
    if (err || messages === null) return reply(Boom.badRequest({ message: 'unable to retrieve messages' }));
    if (messages.length == 0) return reply({ messages: [] });

    for (var i = 0; i < messages.length; i++) {
      var fullMessage = messages[i];
      messageIds.push(fullMessage._id);
      messages[i] = {
        id: fullMessage._id,
        text: fullMessage.text,
        date: fullMessage.createdAt
      };
    }

    savedMessages = messages;

    DirectMessageModel.remove({ _id: messageIds }, removeMessages);
  }

  function removeMessages(err) {
    if (err) {
      console.log(err);
      return reply(Boom.badRequest({ message: 'unable to retrieve messages' }));
    } else
      reply({ messages: savedMessages });
  }

}
