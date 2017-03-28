'use strict';

const companyEndpoint = require('./company.endoipnt.js');
const invoiceEndpoint = require('./invoice.endoipnt');
const authEndpoint = require('./auth.endpoint.js');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const userManager = require('./business/user.manager');
const config = require('./config');

function validate(decoded, request, callback)
{
    return userManager.getUserById(decoded.id).then(function (result)
    {
        return callback(null, true, result);

    }).catch(function ()
    {
        return callback(null, false);
    });

}

function security(server)
{
    server.register(hapiAuthJWT2, function (err)
    {
        if (err) {
            console.log(err);
        }

        server.auth.strategy('jwt', 'jwt', {
            key: config.secret,
            validateFunc: validate,
            verifyOptions: {algorithms: ['HS256']}
        });
        server.auth.default('jwt');
    });
}
module.exports = {
    security,
    companyEndpoint,
    invoiceEndpoint,
    authEndpoint
};
