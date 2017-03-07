'use strict';
const Hapi = require('hapi');

const config = require('./config');
const routes = require('./REST/routes');

const server = new Hapi.Server();
server.connection({
    host: 'localhost', port: config.port
});

routes(server);

server.start(function (err)
{
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
