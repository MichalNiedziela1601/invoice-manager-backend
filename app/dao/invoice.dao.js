'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const readSqlFile = require('../services/readSqlFile');
const path = require('path');
const applicationException = require('../services/applicationException');

function getInvoices(filter)
{
    let sql = 'SELECT * FROM invoice';

    if (filter && filter.type) {
        sql += ' WHERE type =\'' + filter.type + '\'';
    }
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);

    }).catch(() =>
    {
        throw applicationException.new(applicationException.NOT_FOUND, 'Invoice not found');
    });
}

function addInvoice(invoice)
{
    return readSqlFile(path.join(__dirname, '/sql/addInvoice.sql')).then(query =>
    {
        return db.any(query, [invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate, invoice.nettoValue, invoice.bruttoValue,
                              invoice.status, invoice.url, invoice.companyDealer, invoice.companyRecipent, invoice.personDealer, invoice.personRecipent,
                              invoice.googleYearFolderId, invoice.googleMonthFolderId])
                .then(result =>
                {
                    return result;
                }).catch(error =>
                {
                    throw applicationException.new(applicationException.ERROR, error);
                })
    }).catch(error =>
    {
        throw applicationException.new(applicationException.ERROR, error);
    });
}

function getInvoiceById(id)
{
    let query = 'SELECT * FROM invoice WHERE id = $1';
    return db.one(query, [id]).then(invoice => parser.parseObj(invoice))
            .catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'Invoice not found');
            });
}

function updateInvoice(invoice, id)
{
    return readSqlFile(path.join(__dirname, '/sql/updateInvoice.sql')).then(query =>
    {
        return db.none(query, [invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate,
                               invoice.nettoValue, invoice.bruttoValue, invoice.status, id])
                .catch(error =>
                {
                    throw applicationException.new(applicationException.ERROR, error);
                });
    })
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById, updateInvoice
};
