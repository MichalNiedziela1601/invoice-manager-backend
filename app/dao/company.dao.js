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

module.exports = {
    getCompanyAll, addCompany
};
