'use strict';
const config = require('../../config');
const loginManager = require('../../business/login.manager');
const routes = require('../../REST/routes');

//TODO verify when validate invoke
function validate(request, dekodeToken, callback)
{
    loginManager.getUser(dekodeToken.email)
            .then(result => callback(null, true, result));
}

//TODO move this bit to REST layer
module.exports = function (server)
{
    server.register({
        register: require('hapi-auth-jwt')
    }, function (error)
    {
        if (!error) {
            server.auth.strategy('token', 'jwt', {
                key: config.secret, validateFunc: validate, verifyOptions: {algorithms: ['HS256']}
            });
            //TODO routes should be register in app.js
            routes(server);
        } else {
            throw error;
        }
    });
};
