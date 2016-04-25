const BasicAuthController = require('./controllers/BasicAuthController');
const JWTAuthController = require('./controllers/JWTAuthController');
const UserController = require('./controllers/UserController');
const ChatController = require('./controllers/ChatController');
const MessageController = require('./controllers/MessageController');
const BroadcastController = require('./controllers/BroadcastController');

module.exports = [{	
    method: 'GET',
    path: '/auth',
    config: {
        auth: 'simple',
        handler: JWTAuthController.authHandler
    }
}, {
    method: 'POST', 
    path: '/auth/test/login',
    config: {
        auth: 'simple',
        handler: BasicAuthController.testHandler
    }
}, {
    method: 'POST', 
    path: '/auth/test/token',
    handler: JWTAuthController.testHandler
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
    path: '/message/post',
    handler: MessageController.postHandler
}, {
    method: 'GET',
    path: '/message/list',
    handler: MessageController.listHandler
}, {
    method: 'POST',
    path: '/broadcast/post',
    handler: BroadcastController.postHandler
}, {
    method: 'GET',
    path: '/broadcast/list',
    handler: BroadcastController.listHandler
}
];
