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
