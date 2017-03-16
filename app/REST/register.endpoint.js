'use strict';
const joiSchema = require('../joi.schema');
const registerManager = require('../business/register.manager');

module.exports = function (server)
{
    server.route({
        method: 'POST',
        path: '/api/auth/registration',
        config: {validate: {payload: joiSchema.schema.registerCompany}},
        handler: function (request, reply)
        {
            registerManager.registerUserCompany(request.payload).then(() =>
            {
                reply();
            }).catch(error => {
                reply(error);
            })
        }
    })
};
