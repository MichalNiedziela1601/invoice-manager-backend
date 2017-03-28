'use strict';
const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('./joi.schema.js');
const Joi = require('joi');
const _ = require('lodash');
const oauthToken = require('../services/googleApi');
const fs = require('fs');
const path = require('path');
const googleMethods = require('./../services/google.methods');

module.exports = function (server)
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
                reply(error.message).code(404);
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

                Joi.validate(invoice, joiSchema.schema.invoice, function (err)
                {
                    if (err) {
                        reply(err.message).code(400);
                    } else {
                        let name = data.file.hapi.filename;
                        let filepath = path.join(__dirname, '/uploads/', name);
                        let file = fs.createWriteStream(filepath);

                        file.on('error', function (err)
                        {
                            console.error(err);
                        });

                        data.file.pipe(file);

                        data.file.on('end', function (err)
                        {
                            if (err) {
                                throw err;
                            }

                            oauthToken().then(auth =>
                            {
                                googleMethods.saveFile(auth, name).then(response =>
                                {
                                    invoice.url = response.webViewLink;
                                    googleMethods.shareFile(auth, response.id).then(() =>
                                    {
                                        invoiceManager.addInvoice(invoice).then(() =>
                                        {
                                            reply('Invoice add');
                                        });
                                    }).catch(error =>
                                    {
                                        console.error('error', error);
                                        throw error;
                                    })

                                }).catch(error =>
                                {
                                    console.error('error', error);
                                    throw error;
                                })
                            }).catch(error =>
                            {
                                reply(error).code(500);
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
                reply(error.message).code(404);
            });
        }
    })
};
