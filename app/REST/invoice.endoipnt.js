const invoiceManager = require('../business/invoice.manager');

module.exports = function(server){

    server.route({
        method: 'GET',
        path: '/api/invoice',
        handler: function(request,replay){
            invoiceManager.getInvoice().then(result => {
                replay(result);
            })
        }
    })
};
