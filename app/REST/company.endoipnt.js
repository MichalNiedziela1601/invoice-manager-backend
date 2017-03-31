'use strict';
const companyManager = require('../business/company.manager.js');
const joiSchema = require('./joi.schema.js');
module.exports = function (server)
{

    server.route({
        method: 'GET',
        path: '/api/company',
        config: {auth: 'token'},
        handler: function (request, reply)
        {
            companyManager.getCompanies().then(result =>
            {
                reply(result);
            }).catch(error =>
            {
                reply(error.message).code(404);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/api/company',
        config: {auth: 'token',validate: {payload: joiSchema.schema.company}},
        handler: function (request, reply)
        {
            companyManager.addCompany(request.payload).then(() =>
            {
                reply();
            }).catch(error =>
            {
                if (error.message === 'Company with this nip exist in database') {
                    reply(error.message).code(400);
                } else {
                    reply(error.message).code(500);
                }
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/api/address',
        config: {auth: 'token'},
        handler: function (request, reply)
        {
            companyManager.addAddress(request.payload).then(() =>
            {
                reply()
            }).catch(error =>
            {
                reply(error.message);
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/api/company/{nip}',
        config: {auth: 'token',validate: {params: joiSchema.schema.companyByNip}},
        handler: function (request, reply)
        {
            companyManager.getCompanyDetails(request.params.nip).then(company =>
            {
                reply(company);
            }).catch(error =>
            {
                reply(error.message).code(404);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/api/companies/{nip}',
        config: {auth: 'token',validate: {params: joiSchema.schema.companyByNip}},
        handler: function (request, reply)
        {
            companyManager.getNips(request.params.nip).then(company =>
            {
                reply(company);
            }).catch(error =>
            {
                reply(error.message).code(404);
            });
        }
    })
};

