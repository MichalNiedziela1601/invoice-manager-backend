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
            if (company.addressId) {
                return addressDAO.getAddressById(company.addressId).then(address =>
                {
                    company.address = address;
                    return company;
                })
            } else {
                return company;
            }
        })
    });
}

function getCompanyDetails(nip)
{
    return companyDao.getCompanyDetails(nip);
}

function addAddress(address)
{
    return companyDao.addAddress(address)
}
function addCompany(company)
{
    return getCompanyDetails(company.nip).then(() =>
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

function updateCompanyAddress(address, companyId)
{
    return companyDao.getCompanyById(companyId).then(company =>
    {
        if (company.addressId) {
            return addressDAO.updateAddress(address, company.addressId);
        } else {
            return addAddress(address).then(addressId =>
            {
                return companyDao.updateCompanyAddress(addressId, companyId);
            });
        }
    })

}

function addFolderId(folderId,nip){
    return companyDao.addFolderId(folderId,nip);
}

module.exports = {
    getCompanies, addCompany, addAddress, getCompanyDetails, getNips, updateCompanyAddress, addFolderId
};
