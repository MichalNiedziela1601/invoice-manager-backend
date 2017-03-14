'use strict';
const db = require('../services/db.connect');

function getContractorCompanyAll()
{
    let sql = 'SELECT * FROM contractor_company';
    return db.any(sql).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}
function addContractorCompany(contractor)
{
    let sql = 'INSERT INTO Contractor_company (name, shortcut, nip, regon, email, address) VALUES ($1,$2,$3,$4,$5,$6)';
    return db.any(sql, [contractor.name, contractor.shortcut, contractor.nip, contractor.regon, contractor.email, contractor.address]);
}

module.exports = {
    getContractorCompanyAll, addContractorCompany
};
