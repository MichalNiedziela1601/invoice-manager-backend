'use strict';
const companyDao = require('../dao/company.dao.js');
const addressDao = require('../dao/address.dao.js');
const Promise = require('bluebird');

function getCompaniesWithAddress()
{
    return companyDao.getCompanies().then(companies =>
    {
        return Promise.map(companies, company =>
        {
            return addressDao.getAddress(company.addressId).then(address =>
            {
                company.address = address;
                return company;
            });
        });
    });
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

module.exports = {
    getCompaniesWithAddress, addCompany, addAddress, findCompanyByNip
};
