'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const readSqlFile = require('../services/readSqlFile');
const path = require('path');
const applicationException = require('../services/applicationException');

function getInvoices(filter, id)
{
    let sql = 'SELECT * FROM invoice';

    if (filter && filter.type) {
        sql += ' WHERE type =\'' + filter.type + '\' AND ' +
                ('sell' === filter.type ? 'company_dealer = ' + id : 'company_recipent = ' + id);
    }
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);

    });
}

function addInvoice(invoice)
{

    return readSqlFile(path.join(__dirname, '/sql/addInvoice.sql')).then(query =>
    {
        return db.any(query, [invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate, invoice.nettoValue, invoice.bruttoValue,
                              invoice.status, invoice.url, invoice.companyDealer, invoice.companyRecipent, invoice.personDealer, invoice.personRecipent,
                              invoice.googleYearFolderId, invoice.googleMonthFolderId, invoice.year, invoice.month, invoice.number, invoice.products,
                              invoice.description, invoice.paymentMethod, invoice.advance, invoice.fileId, invoice.currency, invoice.language])
                .then(result =>
                {
                    return result;
                })
    }).catch(error =>
    {
        throw applicationException.new(applicationException.ERROR, error);
    });
}

function getInvoiceById(id)
{
    let query = 'SELECT * FROM invoice WHERE id = $1';
    return db.one(query, [id]).then(invoice =>
    {
        return parser.parseObj(invoice)
    })
            .catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'Invoice not found');
            });
}

function updateInvoice(invoice, id)
{
    return readSqlFile(path.join(__dirname, '/sql/updateInvoice.sql')).then(query =>
    {
        return db.none(query, [id, invoice.year, invoice.month, invoice.number, invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate,
                               invoice.nettoValue, invoice.bruttoValue, invoice.status, invoice.url, invoice.companyDealer, invoice.companyRecipent,
                               invoice.personDealer, invoice.personRecipent, invoice.googleYearFolderId, invoice.googleMonthFolderId, invoice.description,
                               invoice.products, invoice.paymentMethod, invoice.advance, invoice.fileId, invoice.currency, invoice.language]);
    }).catch(error =>
    {
        console.error(error);
        throw applicationException.new(applicationException.ERROR, error);
    });
}

function getInvoiceNumber(year, month)
{
    return db.one('SELECT max(number) as number from invoice WHERE year=$1 and month=$2', [year, month]);
}

function getInvoiceFullNumber(year, month, number)
{
    return db.none('SELECT id FROM invoice WHERE year=$1 and month=$2 and number=$3', [year, month, number])
            .catch(() =>
            {
                throw applicationException.new(applicationException.CONFLICT, 'This invoice number exists. Try another!');
            });
}

function changeStatus(id, status)
{
    return db.none('UPDATE invoice SET status = $2 WHERE id = $1', [id, status]);
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById, updateInvoice, getInvoiceNumber, getInvoiceFullNumber, changeStatus
};
