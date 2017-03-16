'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getInvoice()
{
    let sql = 'SELECT * FROM invoice';
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);
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

function getInvoiceById(id)
{
    let query = 'select i.id, i.invoice_nr, i.type, i.create_date, i.execution_end_date, i.netto_value, i.brutto_value, i.status, i.url,'
            + 'cd.id as dealer_id, cd.name as dealer_name, cd.nip as delaer_nip, cd.regon as dealer_regon, ad.street as dealer_street, '
            + 'ad.build_nr as dealer_build_nr, ad.flat_nr as dealer_flat_nr, ad.post_code as dealer_post_code, ad.city as dealer_city,'
            + ' cr.id as recipent_id, cr.name as recipent_name, cr.nip as recipent_nip, cr.regon as recipent_regon, ar.street as recipent_street,'
            + ' ar.build_nr as recipent_build_nr, ar.flat_nr as recipent_falt_nr, ar.post_code as recipent_post_code, ar.city as recipent_city '
            + ' from invoice AS i LEFT JOIN company AS cd ON i.company_dealer = cd.id LEFT JOIN company AS cr ON i.company_recipent = cr.id '
            + 'LEFT JOIN address AS ad ON cd.address = ad.id LEFT JOIN address AS ar ON cr.address = ar.id WHERE i.id = $1;';
    return db.oneOrNone(query, [id]).then(result =>
    {

        if (result === null) {
            result = 'Invoice not found';
            return result
        } else {
            return parser.parseObj(result);
        }
    }).catch(error => {
        console.log('ERROR: ', error.message || error);
        return error;
    })
}

module.exports = {
    getInvoice, addInvoice, getInvoiceById
};
