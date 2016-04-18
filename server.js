'use strict';

const BasicAuthController = require('./controllers/BasicAuthController');
const Hapi = require('hapi');
const JWTAuthController = require('./controllers/JWTAuthController');

const routes = require('./routes');
const server = new Hapi.Server();

server.connection({ port: 80 });

// register plugins
server.register([{
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, {
    register: require('hapi-auth-basic'),
    options: {}
}, {
    register: require('hapi-auth-jwt2'),
    options: {}
}],  (err) => {
    // something bad happened loading the plugins
    if (err) { throw err; }

    server.auth.strategy('simple', 'basic', { 
        validateFunc: BasicAuthController.validate 
    });
    server.auth.strategy('jwt', 'jwt', 'required', { 
        key: JWTAuthController.secret,
        validateFunc: JWTAuthController.validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.route(routes);

    server.start(() => {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
