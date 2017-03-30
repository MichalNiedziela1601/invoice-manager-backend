'use strict';
const companyDao = require('../dao/company.dao.js');
const addressDAO = require('../dao/address.dao');
const Promise = require('bluebird');

function getCompanies()
{
    return companyDao.getCompanies().then(result =>
    {
        return Promise.map(result, function (company)
        {
            return addressDAO.getAddressById(company.addressId).then(address =>
            {
                company.address = address;
                return company;
            })
        })
    });
}

function getCompanyByNip(nip)
{
    return companyDao.getCompanyByNip(nip);
}

function addAddress(address)
{
    return companyDao.addAddress(address)
}
function addCompany(company)
{
    return getCompanyByNip(company.nip).then(() =>
    {
        throw new Error('Company with this nip exist in database');
    }, () =>
    {
        return addAddress(company.address).then(function (addressId)
        {
            company.addressId = addressId;
            return companyDao.addCompany(company)
        });
    });
}


function getNips(nip)
{
    return companyDao.getNips(nip);
}

module.exports = {
    getCompanies, addCompany, addAddress, getCompanyByNip, getNips
};
