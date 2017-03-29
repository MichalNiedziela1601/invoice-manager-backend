'use strict';
const invoiceDao = require('../dao/invoice.dao');
const companyDao = require('../dao/company.dao');
const addressDao = require('../dao/address.dao');
const parser = require('../services/camelCaseParser');
const personDao = require('../dao/person.dao');

function getInvoices(filter)
{
    return invoiceDao.getInvoices(filter);
}

function addInvoice(invoice)
{
    return invoiceDao.addInvoice(invoice);
}

function getInvoiceByCompanyDealerId(invoiceResult)
{
    if (null !== invoiceResult.companyDealer) {
        return companyDao.getCompanyById(invoiceResult.companyDealer).then(company =>
        {
            invoiceResult.companyDealer = company;
            return addressDao.getAddressById(invoiceResult.companyDealer.addressId).then(address =>
            {
                invoiceResult.companyDealer.address = address;
                return invoiceResult;
            })
        });
    } else if (null !== invoiceResult.personDealer) {
        return personDao.getPersonById(invoiceResult.personDealer).then(person =>
        {
            invoiceResult.personDealer = person;
            return addressDao.getAddressById(invoiceResult.personDealer.addressId).then(address =>
            {
                invoiceResult.personDealer.address = address;
                return invoiceResult;
            })
        })
    }
}

function getInvoiceByCompanyRecipentId(invoiceResult)
{
    if (null !== invoiceResult.companyRecipent) {
        return companyDao.getCompanyById(invoiceResult.companyRecipent).then(company =>
        {
            invoiceResult.companyRecipent = company;
        }).then(() =>
        {
            return addressDao.getAddressById(invoiceResult.companyRecipent.addressId).then(address =>
            {
                invoiceResult.companyRecipent.address = address;
                return invoiceResult;
            })
        })
    } else if (null !== invoiceResult.personRecipent) {
        return personDao.getPersonById(invoiceResult.personRecipent).then(person =>
        {
            invoiceResult.personRecipent = person;
        }).then(() =>
        {
            return addressDao.getAddressById(invoiceResult.personRecipent.addressId).then(address =>
            {
                invoiceResult.personRecipent.address = address;
                return invoiceResult;
            })
        })
    }
}

function getInvoiceById(id)
{

    return invoiceDao.getInvoiceById(id).then(invoice => invoice).then(invoice =>
    {
        return getInvoiceByCompanyDealerId(invoice);
    })
            .then(invoice =>
            {
                return getInvoiceByCompanyRecipentId(invoice);
            })
            .catch(error =>
            {
                console.error('ERROR', error);
            });
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById
};
