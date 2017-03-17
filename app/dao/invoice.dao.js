'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const readSqlFile = require('../services/readSqlFile');
const path = require('path');

function getInvoices(filter)
{
    let sql = 'SELECT * FROM invoice';

    if (filter && filter.type) {
        sql += ' WHERE type =\'' + filter.type + '\'';
    }
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);

    }).catch(error =>
    {
        console.error('ERROR invoice.dao.getInvoices:', error.message || error);
        throw error;
    });
}

function addInvoice(invoice)
{
    return readSqlFile(path.join(__dirname, '/sql/addInvoice.sql')).then(query =>
    {
        return db.any(query, [invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate, invoice.nettoValue, invoice.bruttoValue,
                              invoice.status, invoice.url, invoice.companyDealer, invoice.companyRecipent, invoice.personDealer, invoice.personRecipent])
                .then(result =>
                {
                    return result;
                }).catch(error =>
                {
                    console.error('ERROR invoice.dao.addInvoice.readSqlFile:', error.message || error);
                    throw error;
                })
    }).catch(error =>
    {
        console.error('ERROR invoice.dao.addInvoice:', error.message || error);
        throw error;
    });
}

function getInvoiceById(id)
{
    return readSqlFile(path.join(__dirname, '/sql/getInvoiceById.sql')).then(query =>
    {
        return db.one(query, [id]).then(result =>
        {

            if (result === null) {
                result = 'Invoice not found';
                return result
            } else {
                return parser.parseObj(result);
            }
        }).catch(error =>
        {
            console.error('ERROR invoice.dao.etInvoiceById.readSqlFile:', error.message || error);
            throw error;
        })
    }).catch(error =>
    {
        console.error('ERROR invoice.dao.getInvoiceById:', error.message || error);
        throw error;
    });
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById
};
