'use strict';
const companyManager = require('../business/company.manager.js');
const joiSchema = require('./joi.schema.js');
const applicationException = require('../services/applicationException');

module.exports = {
    register: function (server)
    {

        server.route({
            method: 'GET',
            path: '/api/company',

            handler: function (request, reply)
            {
                companyManager.getCompanies().then(result =>
                {
                    reply(result);
                }).catch(error =>
                {
                    applicationException.errorHandler(error, reply);
                });
            }
        });
        server.route({
            method: 'POST',
            path: '/api/company',
            config: {validate: {payload: joiSchema.schema.company}},
            handler: function (request, reply)
            {
                companyManager.addCompany(request.payload).then(reply).catch(error =>
                {
                    applicationException.errorHandler(error, reply);
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/api/company/{nip}',
            config: {validate: {params: joiSchema.schema.companyByNip}},
            handler: function (request, reply)
            {
                companyManager.getCompanyDetails(request.params.nip).then(company =>
                {
                    reply(company);
                }).catch(error =>
                {
                    applicationException.errorHandler(error, reply);
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/api/company/shortcut',
            handler: function (request, reply)
            {
                companyManager.findShortcut(request.query).then(result =>
                {
                    reply(result);
                })
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        });

        server.route({
            method: 'GET',
            path: '/api/company/id',
            handler: (request, reply) =>
            {
                const id = request.query.id;
                companyManager.getCompanyById(id).then(company =>
                {
                    reply(company);
                })
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/company',
            config: {validate: {payload: joiSchema.schema.updatedCompany}},
            handler: (request, reply) =>
            {
                const company = request.payload;
                companyManager.updateCompany(company).then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        })
    }
};

