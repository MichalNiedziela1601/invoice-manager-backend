'use strict';
const db = require('../services/db.connect');

function getInvoice()
{
    let sql = 'SELECT * FROM invoice';
    return db.any(sql).then(result =>
    {
        return result;
    })
}

function addInvoice(invoice)
{
    let sql = 'INSERT INTO invoice (invoice_nr, type, create_date, execution_end_date, netto_value, '
            + 'brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent ) '
            + 'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
    return db.any(sql,
            [invoice.invoice_nr, invoice.type, invoice.create_date, invoice.execution_end_date, invoice.netto_value, invoice.brutto_value, invoice.status,
                invoice.url, invoice.company_dealer, invoice.company_recipent, invoice.person_dealer, invoice.person_recipent]).then(result =>
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
