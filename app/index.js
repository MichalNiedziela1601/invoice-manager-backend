'use strict';
const Hapi = require('hapi');

const config = require('./config');
const routes = require('./REST/routes');
const plugins = require('./services/plugins');

const server = new Hapi.Server();
server.connection({
    host: 'localhost', port: config.port
});

var people = { // our "users database"
    1: {
        id: 1,
        name: 'Jen Jones'
    }
};
function validate(decoded, request, callback)
{
    if (!people[decoded.id]) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
}

server.register(require('hapi-auth-jwt2'), function (err)
{
    if (err) {
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', {
        key: 'NeverShareYourSecret',
        validateFunc: validate,
        verifyOptions: {algorithms: ['HS256']}
    });
    server.auth.default('jwt');
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
