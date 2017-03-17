'use strict';
const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('joi.schema.js');

module.exports = function(server){

    server.route({
        method: 'GET',
        path: '/api/invoice',
        config: {validate: {query: joiSchema.schema.invoiceType}},
        handler: function(request,reply){
            invoiceManager.getInvoices(request.query).then(result => {
                reply(result);
            })
        }
    });
    server.route({
        method: 'POST',
        path: '/api/invoice',
        config: {validate: {payload: joiSchema.schema.invoice}},
        handler: function(request,reply){
            invoiceManager.addInvoice(request.payload).then(() => {
                reply();
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/api/invoice/{id}',
        config: {validate: {params: joiSchema.schema.invoiceById}},
        handler: function(request,reply){
            invoiceManager.getInvoiceById(request.params.id).then(invoice => {
                reply(invoice);
            });
        }
    })
};
