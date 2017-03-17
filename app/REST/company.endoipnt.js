'use strict';
const companyManager = require('../business/company.manager.js');
const joiSchema = require('./joi.schema.js');
module.exports = function (server)
{

    server.route({
        method: 'GET',
        path: '/api/company',
        handler: function (request, reply)
        {
            companyManager.getCompanies().then(result =>
            {
                reply(result);
            }).catch(error => {
                reply(error.message).code(404);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/api/company',
        config: {validate: {payload: joiSchema.schema.company}},
        handler: function (request, reply)
        {
            companyManager.addCompany(request.payload).then(() =>
            {
                reply();
            }).catch(error => {
                reply(error.message);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/api/address',
        handler: function (request, reply)
        {
            companyManager.addAddress(request.payload).then(() =>
            {
                reply()
            }).catch(error => {
                reply(error.message);
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/api/company/{nip}',
        config: {validate: {params: joiSchema.schema.companyByNip}},
        handler: function (request, reply)
        {
            companyManager.findCompanyByNip(request.params.nip).then(company =>
            {
                reply(company);
            }).catch(error => {
                reply(error.message).code(404);
            });
        }
    })
};

