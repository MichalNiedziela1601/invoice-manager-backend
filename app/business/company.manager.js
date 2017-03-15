'use strict';
const companyDao = require('../dao/company.dao.js');

function getCompanyAll()
{
    return companyDao.getCompanyAll();
}
function addCompany(company)
{
    return companyDao.addCompany(company)
}

function findCompanyByNip(nip)
{
    return companyDao.findCompanyByNip(nip);
}

module.exports = {
    getCompanyAll, addCompany, findCompanyByNip
};
