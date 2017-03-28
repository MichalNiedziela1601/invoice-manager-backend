'use strict';
const invoiceDao = require('../dao/invoice.dao');
const companyDao = require('../dao/company.dao');
const addressDao = require('../dao/address.dao');
const personDao = require('../dao/person.dao');

function getInvoices(filter)
{
    return invoiceDao.getInvoices(filter);
}

function addInvoice(invoice)
{
    return invoiceDao.addInvoice(invoice);
}

function getAddressById(id)
{
    return addressDao.getAddressById(id.addressId).then(address =>
    {
        id.address = address;
        return id;
    });
}

function getCompanyById(id)
{
    return companyDao.getCompanyById(id).then(company =>
    {
        id = company;
        return id;
    }).then(getAddressById);
}

function getPersonById(id)
{
    return personDao.getPersonById(id).then(person =>
    {
        id = person;
        return id;
    }).then(getAddressById);
}
function getContractorDetails(invoice, id, callback)
{
    return callback(invoice[id]).then(result =>
    {
        invoice[id] = result;
        return invoice;
    })
}

function getInvoiceById(id)
{
    return invoiceDao.getInvoiceById(id).then(invoice => invoice).then(invoiceResult =>
    {
        if (null !== invoiceResult.companyDealer) {
            return getContractorDetails(invoiceResult, 'companyDealer', getCompanyById);
        } else if (null !== invoiceResult.personDealer) {
            return getContractorDetails(invoiceResult, 'personDealer', getPersonById);
        }
    })
            .then(invoiceResult =>
            {
                if (null !== invoiceResult.companyRecipent) {
                    return getContractorDetails(invoiceResult, 'companyRecipent', getCompanyById);
                } else if (null !== invoiceResult.personRecipent) {
                    return getContractorDetails(invoiceResult, 'personRecipent', getPersonById);
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
