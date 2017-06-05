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
                              invoice.description, invoice.paymentMethod, invoice.advance, invoice.fileId, invoice.currency, invoice.language,
                              invoice.reverseCharge])
                .then(result =>
                {
                    return result;
                })
    }).catch(error =>
    {
        console.error(error);
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
                               invoice.products, invoice.paymentMethod, invoice.advance, invoice.fileId, invoice.currency, invoice.language,
                               invoice.reverseCharge]);
    }).catch(error =>
    {
        console.error(error);
        throw applicationException.new(applicationException.ERROR, error);
    });
}

function getInvoiceNumber(object)
{
    if ('sell' === object.type) {
        return db.one('SELECT max(number) as number from invoice WHERE year=$1 and month=$2 and type = $3 and company_dealer = $4',
                [object.year, object.month, object.type, object.companyId]);
    } else if ('buy' === object.type) {
        return db.one('SELECT max(number) as number from invoice WHERE year=$1 and month=$2 and type = $3 and company_recipent = $4',
                [object.year, object.month, object.type, object.companyId]);
    }

}

function getInvoiceFullNumber(invoice, companyId)
{
    if ('sell' === invoice.type) {
        return db.none('SELECT id FROM invoice WHERE year=$1 and month=$2 and number=$3 and type = $4 and company_dealer = $5',
                [invoice.year, invoice.month, invoice.number, invoice.type, companyId])
                .catch(() =>
                {
                    throw applicationException.new(applicationException.CONFLICT, 'This invoice number exists. Try another!');
                });
    } else if ('buy' === invoice.type) {
        return db.none('SELECT id FROM invoice WHERE year=$1 and month=$2 and number=$3 and type = $4 and company_recipent = $5',
                [invoice.year, invoice.month, invoice.number, invoice.type, companyId])
                .catch(() =>
                {
                    throw applicationException.new(applicationException.CONFLICT, 'This invoice number exists. Try another!');
                });
    }

}

function changeStatus(id, status)
{
    return db.none('UPDATE invoice SET status = $2 WHERE id = $1', [id, status]);
}

function deleteInvoice(id)
{
    return db.none('DELETE FROM invoice WHERE id = $1', [id]);
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById, updateInvoice, getInvoiceNumber, getInvoiceFullNumber, changeStatus, deleteInvoice
};
