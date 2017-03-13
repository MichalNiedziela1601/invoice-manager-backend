'use strict';
const invoiceDao = require('../dao/invoice.dao');

function getInvoice()
{
    return invoiceDao.getInvoice();
}

function addInvoice(invoice)
{
    return invoiceDao.addInvoice(invoice);
}

module.exports = {
    getInvoice, addInvoice
};
