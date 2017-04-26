'use strict';
const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('./joi.schema.js');
const Joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const applicationException = require('../services/applicationException');

function convertToObject(data)
{
    let invoiceCompany = _.pickBy(data, function (value, key)
    {
        return _.startsWith(key, 'invoice');
    });
    let invoice = {};
    _.each(invoiceCompany, function (value, key)
    {
        let newKey = key.match(/\[(\w+)\]/)[1];
        invoice[newKey] = value;
    });
    return invoice;
}

module.exports = {
    register: function (server)
    {

        server.route({
            method: 'GET',
            path: '/api/invoice',
            config: {validate: {query: joiSchema.schema.invoiceType}},
            handler: function (request, reply)
            {
                invoiceManager.getInvoices(request.query).then(result =>
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
            path: '/api/invoice',
            config: {

                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data'
                }
            },
            handler: function (request, reply)
            {
                let data = request.payload;
                if (data.file) {
                    let invoice = convertToObject(data);

                    Joi.validate(invoice, joiSchema.schema.invoice, function (err)
                    {
                        if (err) {
                            applicationException.errorHandler(err,reply);
                        } else {
                            let name = data.file.hapi.filename;
                            try {
                                fs.mkdirSync(path.join(__dirname, '/uploads/'));
                            } catch (error) {
                                if (error.code !== 'EEXIST') {
                                    throw error;
                                }
                            }
                            let filepath = path.join(__dirname, '/uploads/', name);
                            let file = fs.createWriteStream(filepath);

                            file.on('error', function (err)
                            {
                                applicationException.errorHandler(err,reply);
                            });

                            data.file.pipe(file);

                            data.file.on('end', function (err)
                            {
                                if (err) {
                                    throw err;
                                }
                                invoiceManager.addInvoice(name, invoice).then(() =>
                                {
                                    reply('invoice add');
                                }).catch(error =>
                                {
                                    applicationException.errorHandler(error, reply);
                                });
                            })
                        }
                    });
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/api/invoice/{id}',
            config: {validate: {params: joiSchema.schema.invoiceById}},
            handler: function (request, reply)
            {
                invoiceManager.getInvoiceById(request.params.id).then(invoice =>
                {
                    reply(invoice);
                }).catch(error =>
                {
                    applicationException.errorHandler(error, reply)
                });
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/invoice/{id}',
            handler: function (request, reply)
            {
                invoiceManager.updateInvoice(request.payload, request.params.id).then(() =>
                {
                    reply();
                }).catch(error =>
                {
                    applicationException.errorHandler(error, reply)
                })
            }
        })
    }
};
