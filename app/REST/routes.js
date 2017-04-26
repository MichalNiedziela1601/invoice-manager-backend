'use strict';

const companyEndpoint = require('./company.endoipnt.js');
const invoiceEndpoint = require('./invoice.endoipnt');
const userEndpoint = require('./user.endpoint');
const config = require('../config');
const loginManager = require('../business/user.manager.js');
const hapiAuthJwt = require('hapi-auth-jwt');

function validate(request, dekodeToken, callback)
{
    loginManager.getUser(dekodeToken.email)
            .then(result => callback(null, true, result))
            .catch(error => callback(null,false,error));
}


module.exports =
{
    enableSecurity: function (server)
    {
        server.register([hapiAuthJwt], function (error)
        {
            if (!error) {
                server.auth.strategy('token', 'jwt', {
                    key: config.secret, validateFunc: validate, verifyOptions: {algorithms: ['HS256']}
                });

            } else {
                throw error;
            }
            server.auth.default('token');
        });

    },
    register: function(server){
        companyEndpoint.register(server);
        invoiceEndpoint.register(server);
        userEndpoint.register(server);
    }
};
