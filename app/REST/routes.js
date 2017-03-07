'use strict';

const contractorEndpoint = require('./contractor.endoipnt');
const invoiceEndpoint = require('./invoice.endoipnt');

module.exports = function (server)
{
    contractorEndpoint(server);
    invoiceEndpoint(server);
};
