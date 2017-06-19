'use strict';
const companyDao = require('../dao/company.dao.js');
const addressDAO = require('../dao/address.dao');
const Promise = require('bluebird');
const applicationException = require('../services/applicationException');

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
    })
            .catch(error =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, error)
            });
}

function getCompanyDetails(nip)
{
    let companyDetails = {};
    return companyDao.getCompanyByNip(nip).then(company =>
    {
        companyDetails = company;
        return addressDAO.getAddressById(companyDetails.addressId);
    })
            .then(address =>
            {
                companyDetails.address = address;
                return companyDetails;
            });
}

function addCompany(company)
{
    return getCompanyDetails(company.nip).then(() =>
    {
        throw applicationException.new(applicationException.CONFLICT, 'Company with this nip exist in database');
    }, () =>
    {
        return addressDAO.addAddress(company.address).then(function (addressId)
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
            return addressDAO.addAddress(address).then(addressId =>
            {
                return companyDao.updateCompanyAddress(addressId, companyId);
            });
        }
    })

}

function addFolderId(folderId, nip)
{
    return companyDao.addFolderId(folderId, nip);
}

function getCompanyById(id)
{
    let companyDetails = {};
    return companyDao.getCompanyById(id).then(company =>
    {
        companyDetails = company;
        return addressDAO.getAddressById(company.addressId);
    }).then(address =>
    {
        companyDetails.address = address;
        return companyDetails;
    })
}

function findShortcut(filter)
{
    return companyDao.findShortcut(filter);
}

function updateCompany(company)
{
    return companyDao.updateCompany(company).then(() =>
    {
        return addressDAO.updateAddress(company.address, company.addressId);
    })
}

module.exports = {
    getCompanies, addCompany, getCompanyDetails, getNips, updateCompanyAddress, addFolderId, getCompanyById, findShortcut, updateCompany
};
