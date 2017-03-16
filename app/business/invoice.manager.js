'use strict';
const invoiceDao = require('../dao/invoice.dao');

function getInvoices(filter)
{
    return invoiceDao.getInvoices(filter);
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
    getInvoices, addInvoice, getInvoiceById
};
