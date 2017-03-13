'use strict';
const Hapi = require('hapi');

const config = require('./config');
const routes = require('./REST/routes');
const plugins = require('./services/plugins');

const server = new Hapi.Server();
server.connection({
    host: 'localhost', port: config.port
});

plugins(server);
routes(server);

server.start(function (err)
{
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
