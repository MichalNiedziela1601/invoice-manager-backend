'use strict';
const joiSchema = require('../joi.schema');
const authManager = require('../business/auth.manager.js');

module.exports = function (server)
{
    server.route({
        method: 'POST',
        path: '/api/auth/registration',
        config: {validate: {payload: joiSchema.schema.registerCompany}},
        handler: function (request, reply)
        {
            authManager.registerCompany(request.payload).then(() =>
            {
                reply();
            }).catch(error =>
            {
                if (error.message === 'Email exist in database' || error.message === 'Nip exist in database') {
                    reply(error.message).code(409);
                } else {
                    reply(error.message);
                }
            })
        }
    })
};