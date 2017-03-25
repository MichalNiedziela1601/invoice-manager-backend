'use strict';
const companyDao = require('../dao/company.dao.js');

function getCompanies()
{
    return companyDao.getCompanies();
}
function addAddress(address)
{
    return companyDao.addAddress(address)
}
function addCompany(company)
{
    return addAddress(company.address).then(function (addressId)
    {
        company.addressId = addressId;
        return companyDao.addCompany(company)
    }).catch(error =>
    {
        throw error;
    });
}

function findCompanyByNip(nip)
{
    return companyDao.findCompanyByNip(nip);
}

function getNips(nip)
{
    return companyDao.getNips(nip);
}

module.exports = {
    getCompanies, addCompany, addAddress, findCompanyByNip, getNips
};
