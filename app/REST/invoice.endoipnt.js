'use strict';
const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('./joi.schema.js');
const Joi = require('joi');
const _ = require('lodash');
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

        if (key.match(/\[(\w+)\]/)[1] !== 'products') {
            let newKey = key.match(/\[(\w+)\]/)[1];
            invoice[newKey] = value;
        }
    });

    let result = _.reduce(invoiceCompany, (accu, value, key) =>
    {
        if (key.match(/^invoice\[products\]\[(\d+)\]/)) {
            let newKey = key.match(/^invoice\[products\]\[(\d+)\]/)[1];


            accu[newKey] = _.reduce(invoiceCompany, (obj, value, key) =>
            {
                if (key.match(/^invoice\[products\]\[\d+\]\[(\w+)\]/)) {
                    if (newKey === key.match(/^invoice\[products\]\[(\d+)\]/)[1]) {
                        let productKey = key.match(/^invoice\[products\]\[\d+\]\[(\w+)\]/)[1];
                        obj[productKey] = value;
                    }
                }
                return obj;
            }, {});
        }
        return accu;
    }, {});

    _.forIn(result, val =>
    {
        val.netto = Number(val.netto);
        val.brutto = Number(val.brutto);
        if (!_.isNull(val.vat)) {
            val.vat = Number(val.vat);
        }
        if (!_.isNull(val.amount)) {
            val.amount = Number(val.amount);
        }
        val.editMode = false;
    });

    invoice['products'] = result;

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
                const companyId = _.get(request, 'auth.credentials.companyId');
                invoiceManager.getInvoices(request.query, companyId).then(result =>
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
            path: '/api/invoice/upload',
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
                    const companyId = _.get(request, 'auth.credentials.companyId');
                    Joi.validate(invoice, joiSchema.schema.invoice, function (err)
                    {
                        if (err) {
                            applicationException.errorHandler(err, reply);
                        } else {
                            invoiceManager.addInvoice(data.file, invoice, companyId).then(reply).catch(error =>
                            {
                                applicationException.errorHandler(error, reply);
                            });
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
                const invoice = request.payload;
                const id = request.params.id;
                const companyId = _.get(request, 'auth.credentials.companyId');
                if ('sell' === invoice.type) {
                    invoiceManager.updateSellInvoice(invoice, id, companyId).then(reply)
                            .catch(error =>
                            {
                                applicationException.errorHandler(error, reply);
                            })

                } else if ('buy' === invoice.type) {
                    invoiceManager.updateBuyInvoice(invoice, id).then(reply)
                            .catch(error =>
                            {
                                applicationException.errorHandler(error, reply);
                            })
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/api/invoice/number',
            config: {auth: false, validate: {query: joiSchema.schema.invoiceGetNumber}},
            handler: function (request, reply)
            {
                const year = _.get(request, 'query.year');
                const month = _.get(request, 'query.month');
                invoiceManager.getInvoiceNumber(year, month).then(number =>
                {
                    reply(number);
                })
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply)
                        })

            }
        });


        server.route({
            method: 'POST',
            path: '/api/invoice/issue',
            handler: function (request, reply)
            {
                let invoice = request.payload;
                const companyId = _.get(request, 'auth.credentials.companyId');

                invoiceManager.addInvoice('', invoice, companyId).then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        });

        server.route({
            method: 'PUT',
            path: '/api/invoice/{id}/status',
            handler: function (request, reply)
            {
                const id = request.params.id;
                const status = request.payload;
                invoiceManager.changeStatus(id, status.status).then(reply)
                        .catch(error =>
                        {
                            applicationException.errorHandler(error, reply);
                        })
            }
        })
    }
};
