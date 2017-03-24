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

function getInvoiceById(id)
{
    let invoiceResult = {};
    return invoiceDao.getInvoiceById(id).then(invoice =>
    {
        invoiceResult = parser.parseObj(invoice);
    }).then(() =>
    {
        if (null !== invoiceResult.companyDealer) {
            return companyDao.getCompanyById(invoiceResult.companyDealer).then(company =>
            {
                invoiceResult.companyDealer = parser.parseObj(company);
                return addressDao.getAddressById(invoiceResult.companyDealer.addressId).then(address =>
                {
                    invoiceResult.companyDealer.address = parser.parseObj(address);
                    return invoiceResult;
                })

            });
        } else if (null !== invoiceResult.personDealer) {
            return personDao.getPersonById(invoiceResult.personDealer).then(person =>
            {
                invoiceResult.personDealer = parser.parseObj(person);
                return addressDao.getAddressById(invoiceResult.personDealer.addressId).then(address =>
                {
                    invoiceResult.personDealer.address = parser.parseObj(address);
                    return invoiceResult;
                })

            })
        }

    })
            .then(() =>
            {
                if (null !== invoiceResult.companyRecipent) {
                    return companyDao.getCompanyById(invoiceResult.companyRecipent).then(company =>
                    {
                        invoiceResult.companyRecipent = parser.parseObj(company);
                    }).then(() =>
                    {
                        return addressDao.getAddressById(invoiceResult.companyRecipent.addressId).then(address =>
                        {
                            invoiceResult.companyRecipent.address = parser.parseObj(address);
                            return invoiceResult;
                        })
                    })
                } else if (null !== invoiceResult.personRecipent) {
                    return personDao.getPersonById(invoiceResult.personRecipent).then(person =>
                    {
                        invoiceResult.personRecipent = parser.parseObj(person);
                    }).then(() =>
                    {
                        return addressDao.getAddressById(invoiceResult.personRecipent.addressId).then(address =>
                        {
                            invoiceResult.personRecipent.address = parser.parseObj(address);
                            return invoiceResult;
                        })
                    })
                }
            })
            .catch(error =>
            {
                console.error('ERROR', error);
            });
}

module.exports = {
    getInvoices, addInvoice, getInvoiceById
};
