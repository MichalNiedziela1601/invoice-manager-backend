'use strict';
const db = require('../services/db.connect');

function getCompanyAll()
{
    let sql = 'SELECT * FROM company';
    return db.any(sql).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}
function addCompany(company)
{
    let sql = 'INSERT INTO company (name, shortcut, nip, regon, email, address) VALUES ($1,$2,$3,$4,$5,$6)';
    return db.any(sql, [company.name, company.shortcut, company.nip, company.regon, company.email, company.address]);
}

function findCompanyByNip(nip)
{
    let query = 'SELECT c.id,c.name,c.nip, c.regon, c.email, a.street, a.build_nr, a.flat_nr, a.post_code, a.city '
            + 'FROM company AS c LEFT JOIN address AS a ON c.address = a.id WHERE c.nip = $1';
    return db.oneOrNone(query, [nip]).then(result =>
    {
        if (result === null) {
            result = 'Company not found';
        }
        return result;
    })
}

module.exports = {
    getCompanyAll, addCompany, findCompanyByNip
};
