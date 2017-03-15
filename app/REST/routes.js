'use strict';

const companyEndpoint = require('./company.endoipnt.js');
const invoiceEndpoint = require('./invoice.endoipnt');

module.exports = function (server)
{
    companyEndpoint(server);
    invoiceEndpoint(server);
};
