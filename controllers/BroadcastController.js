const UserModel = require('../models/UserModel');
const BankUserModel = require('../models/BankUserModel');
const ChatModel = require('../models/ChatModel');
const BroadcastModel = require('../models/BroadcastModel');
const Boom = require('boom');
const Util = require('../Util');

exports.postHandler = function (request, reply) {
  var userId = request.auth.credentials.sub;
  var query = request.query;

  UserModel.findOne({ _id: userId }, findUser);

  function findUser(err, user) {
    if (err || user === null)
      return reply(Boom.badImplementation('db error'));
    BankUserModel.findOne({ _id: user._bankId }, findBankUser);
  }

  function findBankUser(err, user) {
    if (err || user === null)
      return reply(Boom.badImplementation('db error'));
    else if (user.role != 'employee')
      return reply(Boom.unauthorized('Only employees can make broadcasts.'));

    BroadcastModel.create({ 
      _userId: userId, 
      expireAt: Date.now() + (query.expires * 1000), 
      title: query.title,
      text: query.text 
    }, createBroadcast);
  }

  function createBroadcast(err, broadcast) {
    console.log(err);
    if (err || broadcast === null)
      return reply(Boom.badImplementation('db error'));
    return reply({ id: broadcast._id });
  }
}

exports.listHandler = function(request, reply) {

  BroadcastModel.find({}, findBroadcasts);

  function findBroadcasts(err, broadcasts) {
    if (err) return reply(Boom.badImplementation('db error'));

    return reply({ broadcasts: broadcasts });
  }
}
