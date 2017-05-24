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
                    const token = jwt.sign(
                            {email: result.email, companyId: result.companyId},
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
                    _.assign(userInfo, {email: email});
                    reply(userInfo);
                }).catch(error => applicationException.errorHandler(error, reply))
            }
        });

        server.route({
            method: 'POST',
            path: '/api/user/newUser',
            handler: function (request, reply)
            {
                const payload = request.payload;
                userManager.addNewUser(payload).then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        });
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/user/address',
            config: {validate: {payload: joiSchema.schema.address}},
            handler: function (request, reply)
            {
                const address = request.payload;
                companyManager.updateCompanyAddress(address, address.id).then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/user/account',
            config: { validate: {payload: joiSchema.schema.account}},
            handler: function (request, reply)
            {
                const account = request.payload;
                const companyId = _.get(request, 'auth.credentials.companyId');
                userManager.updateAccount(account, companyId)
                        .then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        })
    }
};
