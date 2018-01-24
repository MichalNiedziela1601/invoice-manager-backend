'use strict';
const Hapi = require('hapi');

const config = require('./config');
const plugins = require('./services/plugins');
const routes = require('./REST/routes');

const server = new Hapi.Server();
server.connection({
    host: 'localhost', port: config.port
});

plugins(server);
routes.enableSecurity(server);
routes.register(server);

server.start(function (err)
{
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
