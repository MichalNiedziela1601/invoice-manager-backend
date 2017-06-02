'use strict';

const personManager = require('../business/person.manager');
const _ = require('lodash');
const applicationException = require('../services/applicationException');

module.exports = {
    register: function (server)
    {
        server.route({
            method: 'GET',
            path: '/api/person/findByName',
            handler: function(request,reply){
                const lastName = _.get(request,'query.lastName');
                personManager.findPersonBySurname(lastName).then(result => {
                    reply(result);
                })
                        .catch(error => {
                            applicationException.errorHandler(error,reply);
                        })
            }
        });

        server.route({
            method: 'GET',
            path: '/api/person/{id}',
            handler: function(request,reply)
            {
                const id = request.params.id;
                personManager.getPersonById(id).then(result => {
                    reply(result);
                })
                        .catch(error => {
                            applicationException.errorHandler(error,reply);
                        })
            }
        })
    }
};
