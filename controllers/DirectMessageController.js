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
    DirectMessageModel.create({ _userIdFrom: request.auth.credentials.sub, _userIdTo: user._id,
      text: request.query.text }, createMessage);
  }

  function createMessage(err, message) {
    if (err) console.log(err);
    if (err || message === null) return reply(Boom.badRequest({ message: 'unable to send message' }));
    reply({ message: 'message sent' });
  }
}

exports.listHandler = function(request, reply) {
  var savedMessages;

  DirectMessageModel.find({ _userIdTo: request.auth.credentials.sub }).populate('_userIdFrom').exec(findMessages);

  function findMessages(err, messages) {
    if (err) console.log(err);
    if (err || messages === null) return reply(Boom.badRequest({ message: 'unable to retrieve messages' }));
    if (messages === null) return reply({ messages: [] });

    for (var i = 0; i < messages.length; i++) {
      var fullMessage = messages[i];
      messages[i] = {
        id: fullMessage._id,
        from: fullMessage._userIdFrom.email,
        text: fullMessage.text,
        date: fullMessage.createdAt
      };
    }

    savedMessages = messages;

    DirectMessageModel.find({ _userIdTo: request.auth.credentials.sub }).remove(removeMessages);
  }

  function removeMessages(err) {
    if (err) {
      console.log(err);
      return reply(Boom.badRequest({ message: 'unable to retrieve messages' }));
    } else
      reply({ messages: savedMessages });
  }

}
