'use strict';
const companyManager = require('../business/company.manager');
const joiSchema = require('./joi.schema.js');
const authManager = require('../business/auth.manager.js');
const userManager = require('../business/user.manager.js');
const jwt = require('jsonwebtoken');
const config = require('../config');
const _ = require('lodash');
const applicationException = require('../services/applicationException');
module.exports = {
    register: function (server)
    {

        server.route({
            method: 'POST',
            path: '/api/user/addAddress',
            handler: function (request, reply)
            {
                const companyId = _.get(request, 'auth.credentials.company.id');
                const address = request.payload;
                companyManager.updateCompanyAddress(address, companyId).then(() =>
                {
                    reply();
                })
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        });

        server.route({
            method: 'POST',
            path: '/api/user/registration',
            config: {auth: false, validate: {payload: joiSchema.schema.registerCompany}},
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
            path: '/api/user/auth',
            config: {auth: false},
            handler: function (req, res)
            {
                const credentials = req.payload;
                userManager.authenticate(credentials).then(result =>
                {
                    const token = jwt.sign({id: result.id, email: result.email, nip: result.company.nip, companyId: result.company.id},
                                           config.secret, {algorithm: 'HS256', expiresIn: '1h'});
                    res({token: token});
                }).catch(error =>
                {
                    applicationException.errorHandler(error, res);
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/api/user/auth',
            handler: function (request, reply)
            {
                const email = _.get(request, 'auth.credentials.email');
                userManager.getUserInformation(email).then(userInfo =>
                {
                    reply(userInfo);
                }).catch(error => applicationException.errorHandler(error, reply))
            }
        })
    }
};
