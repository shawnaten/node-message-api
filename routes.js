const BasicAuthController = require('./controllers/BasicAuthController');
const JWTAuthController = require('./controllers/JWTAuthController');
const UserController = require('./controllers/UserController');
const ChatController = require('./controllers/ChatController');
const MessageController = require('./controllers/MessageController');
const BroadcastController = require('./controllers/BroadcastController');
const DirectMessageController = require('./controllers/DirectMessageController');
const KeyController = require('./controllers/KeyController');

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
    auth: false,
    handler: function(request, reply) {
      var message = 'UTSA CS 4913'
      var fruits = ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒',
        '🍑','🍍'];
      var response = '';

      for (var i=0; i < 1000; i++) {
        for (var j=0; j < fruits.length; j++)
          response += fruits[Math.floor(Math.random() * fruits.length)];
        if (i % 10 == 0)
          response += message;
      }

      reply(response);
    }
  }
}, {
  method: 'GET',
  path: '/auth',
  config: {
    auth: 'simple',
    handler: JWTAuthController.authHandler
  }
}, {
  method: 'GET',
  path: '/auth/list',
  handler: JWTAuthController.listHandler
},{
  method: 'POST',
  path: '/auth',
  handler: JWTAuthController.removeHandler
}, {
  method: 'POST',
  path: '/user/create',
  config: {
    auth: false,
    handler: UserController.createHandler
  }
}, {
  method: 'GET',
  path: '/user/verify',
  config: {
    auth: false,
    handler: UserController.verifyHandler
  }
}, {
  method: 'POST',
  path: '/chat/start',
  handler: ChatController.startHandler
}, {
  method: 'POST',
  path: '/user/delete',
  config: {
    auth: 'simple',
    handler: UserController.deleteHandler
  }
}, {
  method: 'GET',
  path: '/chat/list',
  handler: ChatController.listHandler
}, {
  method: 'POST',
  path: '/chat/leave',
  handler: ChatController.leaveHandler
}, {
  method: 'POST',
  path: '/chat/add',
  handler: ChatController.addHandler
}, {
  method: 'POST',
  path: '/message/send',
  handler: DirectMessageController.sendHandler
}, {
  method: 'GET',
  path: '/message/list',
  handler: DirectMessageController.listHandler
}, {
  method: 'GET',
  path: '/message/key',
  handler: KeyController.getHandler
}, {
  method: 'POST',
  path: '/message/key',
  handler: KeyController.addHandler
}
];
