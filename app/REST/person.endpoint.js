'use strict';

const personManager = require('../business/person.manager');
const _ = require('lodash');
const applicationException = require('../services/applicationException');
const joiSchema = require('./joi.schema');

module.exports = {
    register: function (server)
    {
        server.route({
            method: 'GET',
            path: '/api/person/findByName',
            handler: function (request, reply)
            {
                const lastName = _.get(request, 'query.lastName');
                personManager.findPersonBySurname(lastName).then(result =>
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
            path: '/api/person/{id}',
            handler: function (request, reply)
            {
                const id = request.params.id;
                personManager.getPersonById(id).then(result =>
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
            method: 'POST',
            path: '/api/person',
            config: {validate: {payload: joiSchema.schema.person}},
            handler: (request, reply) =>
            {
                const person = request.payload;
                personManager.addPerson(person).then(result =>
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
            path: '/api/person/shortcut',
            handler: function (request, reply)
            {
                personManager.findShortcut(request.query).then(result =>
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
            path: '/api/person/nip',
            handler: function(request, reply)
            {
                const nip = request.query.nip;
                personManager.findByNip(nip).then(result =>
                {
                    reply(result);
                }).catch(error =>
                {
                    applicationException.errorHandler(error, reply);
                })
            }
        });

        server.route({
            method: 'GET',
            path: '/api/person',
            handler: (request,reply) => {
                personManager.getPersons().then(result => {
                    reply(result);
                })
                        .catch(error => {
                            applicationException.errorHandler(error,reply);
                        })
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/person',
            config: {validate: {payload: joiSchema.schema.updatedPerson}},
            handler: (request,reply) => {
                const person = request.payload;
                personManager.updatePerson(person).then(reply)
                        .catch(error => {
                            applicationException.errorHandler(error,reply);
                        })
            }
        })
    }
};
