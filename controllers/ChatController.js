const UserModel = require('../models/UserModel');
const BankUserModel = require('../models/BankUserModel');
const ChatModel = require('../models/ChatModel');
const Boom = require('boom');
const Util = require('../Util');

exports.startHandler = function (request, reply) {
    var savedUser;

    UserModel.findOne({ _id: request.auth.credentials.sub }, findUser);

    function findUser(err, user) {
        if (err || user === null) return reply(Boom.badImplementation('db error'));
        else ChatModel.create({ _users: [ user._id ], topic: request.query.topic }, createChat);
    }

    function createChat(err, chat) {
        if (err || chat === null) return reply(Boom.badImplementation('db error'));
        reply({ id: chat._id });
    }
}

exports.listHandler = function(request, reply) {
    ChatModel.find({ _users: request.auth.credentials.sub }, findChats);

    function findChats(err, chats) {
        if (err || chats === null)
            return reply(Boom.badImplementation('db error'));

        for (var i = 0; i < chats.length; i++) {
            var fullChat = chats[i];
            chats[i] = {
                id: fullChat._id,
                topic: fullChat.topic,
                date: fullChat.createdAt
            };
        }
            
        return reply({ chats: chats });
    }
}

exports.leaveHandler = function(request, reply) {
    ChatModel.findOne({ _id: request.query.id, _users: request.auth.credentials.sub }, findChat);

    function findChat(err, chat) {
        var users;

        if (err || chat === null) return reply(Boom.badImplementation('db error'));

        chat = result;
        users = chat._users;

        users.splice(users.indexOf(credentials.sub), 1);

        if (users.length == 0) ChatModel.remove({ _id: chat._id }, removeChat);
        else chat.save(saveChat);
    }

    function saveChat(err) {
        if (err) return reply(Boom.badImplementation('db error'));
        else reply({ message: 'user removed from chat' });
    }

    function removeChat(err) {
        if (err) return reply(Boom.badImplementation('db error'));
        else reply({ message: 'user removed from chat' });
    }
}

exports.addHandler = function(request, reply) {
    var savedChat;

    ChatModel.findOne({ _id: request.query.id, _users: request.auth.credentials.sub }, findChat);

    function findChat(err, chat) {
      savedChat = chat;

      if (err) return reply(Boom.badImplementation(err));
      else if (chat === null) return reply(Boom.badRequest({ messsage: 'no chat found' }));
  
      UserModel.findOne({ email: request.query.email }, findUser);
    }

    function findUser(err, user) {
      if (err) return reply(Boom.badImplementation(err));
      else if (user === null) return reply(Boom.badRequest({ messsage: 'no user found to add' }));
      
      for(var i=0; i<chat._users.length; i++)
        if (chat._users[i] == user._id)
          return reply(Boom.badRequest({ messsage: 'user already in chat' }));
        
      chat._users.push(user._id);
      chat.save(saveChat);
    }
    
    function saveChat(err) {
        if (err) return reply(Boom.badImplementation('db error'));
        else reply({ message: 'user removed from chat' });
    }
}
