'use strict';
const invoiceDao = require('../dao/invoice.dao');

function getInvoice()
{
    return invoiceDao.getInvoice();
}

module.exports = {
    getInvoice
};
