'use strict';
const companyDao = require('../dao/company.dao.js');

function getCompanies()
{
    return companyDao.getCompanies();
}
function addCompany(company)
{
    return companyDao.addCompany(company)
}
function addAddress(address)
{
    return companyDao.addAddress(address)
}
function findCompanyByNip(nip)
{
    return companyDao.findCompanyByNip(nip);
}

module.exports = {
    getCompanies, addCompany, addAddress, findCompanyByNip
};
