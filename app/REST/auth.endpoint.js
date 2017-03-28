'use strict';
const joiSchema = require('./joi.schema.js');
const authManager = require('../business/auth.manager.js');

module.exports = function (server)
{
    server.route({
        method: 'POST',
        path: '/api/auth/registration',
        config: {validate: {payload: joiSchema.schema.registerCompany}, auth: false},
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
    })
};
