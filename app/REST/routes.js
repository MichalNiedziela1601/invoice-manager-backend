'use strict';

const companyEndpoint = require('./company.endoipnt.js');
const invoiceEndpoint = require('./invoice.endoipnt');
const registerEndpoint = require('./register.endpoint');

module.exports = function (server)
{
    companyEndpoint(server);
    invoiceEndpoint(server);
    registerEndpoint(server);
};
