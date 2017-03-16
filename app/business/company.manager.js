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
function addAddress(address)
{
    return companyDao.addAddress(address)
}
function findCompanyByNip(nip)
{
    return companyDao.findCompanyByNip(nip);
}

module.exports = {
    getCompanyAll, addCompany, addAddress, findCompanyByNip
};