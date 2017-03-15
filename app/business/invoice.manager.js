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

function getInvoiceById(id)
{
    return invoiceDao.getInvoiceById(id);
}

module.exports = {
    getInvoice, addInvoice, getInvoiceById
};
