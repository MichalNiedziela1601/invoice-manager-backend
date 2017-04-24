'use strict';
const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('./joi.schema.js');
const Joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

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

module.exports = function (server)
{

    server.route({
        method: 'GET',
        path: '/api/invoice',
        config: {auth: 'token', validate: {query: joiSchema.schema.invoiceType}},
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
            auth: 'token',
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
                            invoiceManager.addInvoice(name, invoice).then(() =>
                            {
                                reply('invoice add');
                            }).catch(error =>
                            {
                                reply(error.message || error).code(500);
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
        config: {auth: 'token', validate: {params: joiSchema.schema.invoiceById}},
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
                reply(error.message).code(400);
            })
        }
    })
};
