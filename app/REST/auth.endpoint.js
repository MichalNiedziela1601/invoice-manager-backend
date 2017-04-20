'use strict';
const joiSchema = require('./joi.schema.js');
const authManager = require('../business/auth.manager.js');
const loginManager = require('../business/login.manager');
//TODO move to user.endpoint
module.exports = function (server)
{
    server.route({
        method: 'POST',
        path: '/api/auth/registration',
        config: {validate: {payload: joiSchema.schema.registerCompany}},
        handler: function (request, reply)
        {
            authManager.registerCompany(request.payload).then(res =>
            {
                reply(res);
            }).catch(error =>
            {
                if (error.message === 'Email exist in database' || error.message === 'Nip exist in database') {
                    reply(error.message).code(409);
                } else {
                    reply(error.message).code(500);
                }
            })
        }
    });

    server.route({
        method: 'POST',
        path: '/api/auth/login',
        handler: function (req, res)
        {
            let person = req.payload;
            loginManager.login(person).then(result =>
            {
                //TODO Generate token here, userManager.authenticate should return user object
                res({token: result});
            }).catch(error =>
            {
                res(error).code(400);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/api/auth/login',
        config: {
            auth: 'token'
        },
        handler: function (request, reply)
        {
            let email = request.auth.credentials.email;
            loginManager.getUserInformation(email).then(userInfo =>
            {
                reply(userInfo);
            })
        }
    })
};
