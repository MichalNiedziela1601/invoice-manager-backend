'use strict';

const companyEndpoint = require('./company.endoipnt.js');
const invoiceEndpoint = require('./invoice.endoipnt');
const authEndpoint = require('./auth.endpoint.js');

module.exports = function (server)
{
    companyEndpoint(server);
    invoiceEndpoint(server);
    authEndpoint(server);
};
