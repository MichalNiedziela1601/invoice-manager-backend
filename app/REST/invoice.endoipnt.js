const invoiceManager = require('../business/invoice.manager');
const joiSchema = require('../joi.schema.js');

module.exports = function(server){

    server.route({
        method: 'GET',
        path: '/api/invoice',
        handler: function(request,reply){
            invoiceManager.getInvoice().then(result => {
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
    })
};
