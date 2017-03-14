'use strict';
const db = require('../services/db.connect');

function getInvoice()
{
    let sql = 'SELECT * FROM invoice';
    return db.any(sql).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}

function addInvoice(invoice)
{
    let sql = 'INSERT INTO invoice (invoice_nr, type, create_date, execution_end_date, netto_value, '
            + 'brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent ) '
            + 'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
    return db.any(sql, [invoice.invoiceNr, invoice.type, invoice.createDate, invoice.executionEndDate, invoice.nettoValue, invoice.bruttoValue,
                        invoice.status, invoice.url, invoice.companyDealer, invoice.companyRecipent, invoice.personDealer, invoice.personRecipent])
            .then(result =>
            {
                return result;
            }).catch(error =>
            {
                console.log('ERROR:', error.message || error);
                return error;
            })
}

module.exports = {
    getInvoice, addInvoice
};
