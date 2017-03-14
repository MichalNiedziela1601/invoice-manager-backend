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

module.exports = {
    getContractorCompanyAll
};
