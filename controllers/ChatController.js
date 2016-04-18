const UserModel = require('../models/UserModel');
const BankUserModel = require('../models/BankUserModel');
const ChatModel = require('../models/ChatModel');
const Boom = require('boom');
const Util = require('../Util');

exports.startHandler = function (request, reply) {
    var credentials = request.auth.credentials;
    
    var employee;
    var apiUser;
    var bankUser;
    var chat;

    BankUserModel.find({ role: 'employee' }, findEmployee);

    function findEmployee(err, result) {
        if (err || result === null)
            return reply(Boom.badImplementation('db error'));
        employee = result[Util.randomInt(0, result.length)];
        UserModel.findOne({ _id: credentials.sub }, findUser);
    }

    function findUser(err, result) {
        if (err || result === null)
            return reply(Boom.badImplementation('db error'));
        apiUser = result;
        BankUserModel.findOne({ _id: apiUser._bankId }, findBankUser);
    }

    function findBankUser(err, result) {
        bankUser = result;

        if (err || result === null)
            return reply(Boom.badImplementation('db error'));
        else if (bankUser.role != 'customer')
            return reply(Boom.unauthorized('only customers may initiate chat'));
        else
            ChatModel.create({ 
                _users: [employee._id, apiUser._id],
                topic: request.query.topic
                }, createChat);
    }

    function createChat(err, result) {
        if (err || result === null)
            return reply(Boom.badImplementation('db error'));
        chat = result;
        reply({ id: chat._id });
    }
}

exports.listHandler = function(request, reply) {
    var credentials = request.auth.credentials;
    var user;
    var chats;

    ChatModel.find({ _users: credentials.sub }, findChats);

    function findChats(err, result) {
        chats = result;
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

exports.removeHandler = function(request, reply) {
    var credentials = request.auth.credentials;

    ChatModel.findOne({ _id: request.query.id, _users: credentials.sub }, findChat);

    function findChat(err, result) {
        var users;

        if (err || result === null)
            return reply(Boom.badImplementation('db error'));

        chat = result;
        users = chat._users;

        users.splice(users.indexOf(credentials.sub), 1);

        if (users.length == 1)
            ChatModel.remove({ _id: chat._id }, removeChat);
        else
            reply('user removed from chat');
    }

    function removeChat(err) {
        if (err)
            return reply(Boom.badImplementation('db error'));
        reply('user removed and chat deleted');
    }
}
