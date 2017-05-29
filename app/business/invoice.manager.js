'use strict';
const invoiceDao = require('../dao/invoice.dao');
const companyDao = require('../dao/company.dao');
const addressDao = require('../dao/address.dao');
const personDao = require('../dao/person.dao');
const oauthToken = require('../services/googleApi');
const googleMethods = require('../services/google.methods');
const folderMethods = require('../services/createFoldersGoogle');
const applicationException = require('../services/applicationException');
const _ = require('lodash');
const Promise = require('bluebird');
const pdfGenerator = require('./pdfContent');
const PdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');

const fonts = {
    Roboto: {
        normal: './fonts/Roboto-Regular.ttf',
        bold: './fonts/Roboto-Medium.ttf',
        italics: './fonts/Roboto-Italic.ttf',
        bolditalics: './fonts/Roboto-Italic.ttf'
    }
};

function getInvoices(filter, id)
{
    return invoiceDao.getInvoices(filter, id).then(invoices =>
    {
        if ('sell' === filter.type) {
            return Promise.map(invoices, invoice =>
            {
                if (invoice.companyRecipent) {
                    return companyDao.getCompanyById(invoice.companyRecipent)
                            .then(company =>
                            {
                                invoice.companyRecipent = company;
                                return invoice;
                            })
                } else if (invoice.personRecipent) {
                    return personDao.getPersonById(invoice.personRecipent)
                            .then(person =>
                            {
                                invoice.personRecipent = person;
                                return invoice;
                            })
                }
            })
        } else if ('buy' === filter.type) {
            return Promise.map(invoices, invoice =>
            {
                if (invoice.companyDealer) {
                    return companyDao.getCompanyById(invoice.companyDealer)
                            .then(company =>
                            {
                                invoice.companyDealer = company;
                                return invoice;
                            })
                } else if (invoice.personDealer) {
                    return personDao.getPersonById(invoice.personDealer)
                            .then(person =>
                            {
                                invoice.personDealer = person;
                                return invoice;
                            })
                }
            })
        }
    })
            .catch(function (error)
            {
                console.error('ERROR - getInvoices: ' + error);
                throw applicationException.new(applicationException.ERROR, 'Something bad with getInvoices')
            });
}

function addInvoice(data, invoice, companyId)
{
    invoice.year = new Date(invoice.createDate).getFullYear();
    invoice.month = new Date(invoice.createDate).getMonth() + 1;
    invoice.number = parseInt(_.split(invoice.invoiceNr, '/')[2], 10);
    let auth = null;
    let invoiceId = 0;
    let filename = null;

    return invoiceDao.getInvoiceFullNumber(invoice.year, invoice.month, invoice.number).then(() =>
    {
        return invoiceDao.addInvoice(invoice);
    })
            .then(result =>
            {
                invoiceId = result[0].id;
                if ('sell' === invoice.type) {
                    if ('company' === invoice.contractorType) {
                        return companyDao.getCompanyById(invoice.companyRecipent);
                    } else if ('person' === invoice.contractorType) {
                        return personDao.getPersonById(invoice.personRecipent);
                    }
                } else if ('buy' === invoice.type) {
                    if ('company' === invoice.contractorType) {
                        return companyDao.getCompanyById(invoice.companyDealer);
                    } else if ('person' === invoice.contractorType) {
                        return personDao.getPersonById(invoice.personDealer);
                    }
                }
            })
            .then(contractor =>
            {
                try {
                    fs.mkdirSync(path.join(__dirname, '../REST/uploads/'));
                } catch (error) {
                    if (error.code !== 'EEXIST') {
                        throw error;
                    }
                }
                let date = new Date(invoice.createDate).toISOString().replace(/T/, ' ')
                        .replace(/\..+/, '')
                        .match(/(\d{4}-\d{2}-\d{2})/)[1];

                if ('sell' === invoice.type) {
                    filename = String('INC-' + contractor.shortcut + '-' + date + '-' + invoiceId + '.pdf');
                    return pdfGenerator(invoice)
                            .then(content =>
                            {
                                const printer = new PdfMakePrinter(fonts);
                                let pdfDoc = {};
                                try {
                                    pdfDoc = printer.createPdfKitDocument(content);
                                } catch (error) {
                                    throw applicationException.new(applicationException.ERROR, 'Something bad in pdf content: ' + error);
                                }

                                let filepath = path.join(__dirname, '../REST/uploads/', filename);
                                let result = pdfDoc.pipe(fs.createWriteStream(filepath));
                                pdfDoc.end();
                                return new Promise(resolve =>
                                {
                                    result.on('finish', resolve);
                                })
                            })
                } else if ('buy' === invoice.type) {
                    filename = String('EXP-' + contractor.shortcut + '-' + date + '-' + invoiceId + '.pdf');
                    let filepath = path.join(__dirname, '../REST/uploads/', filename);

                    let result = data.pipe(fs.createWriteStream(filepath));

                    return new Promise(resolve =>
                    {
                        result.on('finish', resolve);
                    });
                }
            })
            .then(() =>
            {
                return oauthToken();
            })
            .then(token =>
            {
                auth = token;
                return folderMethods.createFolderCompany(auth, companyId);
            })
            .then(companyFolderId =>
            {
                return folderMethods.createYearMonthFolder(auth, invoice, companyFolderId);
            })
            .then(invoice =>
            {
                return googleMethods.saveFile(auth, filename, invoice);
            })
            .then(response =>
            {
                invoice.url = response.webViewLink;
                invoice.fileId = response.id;
                return googleMethods.shareFile(auth, response.id);
            })
            .then(() =>
            {
                return invoiceDao.updateInvoice(invoice, invoiceId);
            })
            .catch(error =>
            {
                return invoiceDao.deleteInvoice(invoiceId).then(() =>
                {
                    if (applicationException.is(error)) {
                        throw error;
                    }
                    throw applicationException.new(applicationException.ERROR, error);
                });

            });

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
                throw applicationException(applicationException.ERROR, error);
            });
}

function checkInvoiceNumber(updatedInvoice, id)
{
    return invoiceDao.getInvoiceById(id).then(invoice =>
    {
        if (updatedInvoice.year === invoice.year && updatedInvoice.month === invoice.month && updatedInvoice.number === invoice.number) {
            return 0;
        } else {
            return invoiceDao.getInvoiceFullNumber(updatedInvoice.year, updatedInvoice.month, updatedInvoice.number);
        }
    })
}

function updateSellInvoice(invoice, id, companyId)
{
    invoice.year = new Date(invoice.createDate).getFullYear();
    invoice.month = new Date(invoice.createDate).getMonth() + 1;
    invoice.number = parseInt(_.split(invoice.invoiceNr, '/')[2], 10);

    let auth = null;
    let filename = null;
    return checkInvoiceNumber(invoice, id).then(() =>
    {
        return invoiceDao.updateInvoice(invoice, id)
    })
            .then(() =>
            {
                return oauthToken();
            })
            .then(token =>
            {
                auth = token;
                return googleMethods.deleteFile(auth, invoice);
            })
            .then(() =>
            {
                if ('company' === invoice.contractorType) {
                    return companyDao.getCompanyById(invoice.companyRecipent);
                } else if ('person' === invoice.contractorType) {
                    return personDao.getPersonById(invoice.personRecipent);
                }

            })
            .then(contractor =>
            {
                try {
                    fs.mkdirSync(path.join(__dirname, '../REST/uploads/'));
                } catch (error) {
                    if (error.code !== 'EEXIST') {
                        throw error;
                    }
                }
                let date = new Date(invoice.createDate).toISOString().replace(/T/, ' ')
                        .replace(/\..+/, '')
                        .match(/(\d{4}-\d{2}-\d{2})/)[1];

                filename = String('INC-' + contractor.shortcut + '-' + date + '-' + id + '.pdf');
                return pdfGenerator(invoice)
                        .then(content =>
                        {

                            const printer = new PdfMakePrinter(fonts);
                            let pdfDoc = {};
                            try {
                                pdfDoc = printer.createPdfKitDocument(content);
                            } catch (error) {
                                throw error;
                            }
                            let filepath = path.join(__dirname, '../REST/uploads/', filename);
                            let result = pdfDoc.pipe(fs.createWriteStream(filepath));
                            pdfDoc.end();
                            return new Promise(resolve =>
                            {
                                result.on('finish', resolve);
                            })
                        })
            })
            .then(() =>
            {
                return folderMethods.createFolderCompany(auth, companyId);
            })
            .then(companyFolderId =>
            {
                return folderMethods.createYearMonthFolder(auth, invoice, companyFolderId);
            })
            .then(invoice =>
            {
                return googleMethods.saveFile(auth, filename, invoice);
            })
            .then(response =>
            {
                invoice.url = response.webViewLink;
                invoice.fileId = response.id;
                return googleMethods.shareFile(auth, response.id);
            })
            .then(() =>
            {
                return invoiceDao.updateInvoice(invoice, id);
            })
            .catch(error =>
            {
                if (applicationException.is(error)) {
                    throw error;
                } else {
                    throw applicationException.new(applicationException.ERROR, error);
                }
            });

}

function updateBuyInvoice(invoice, id)
{
    invoice.year = new Date(invoice.createDate).getFullYear();
    invoice.month = new Date(invoice.createDate).getMonth() + 1;
    invoice.number = parseInt(_.split(invoice.invoiceNr, '/')[2], 10);

    let auth = null;
    let filename = null;
    return checkInvoiceNumber(invoice, id).then(() =>
    {
        return invoiceDao.updateInvoice(invoice, id)
    })
            .then(() =>
            {
                return oauthToken();
            })
            .then(token =>
            {
                auth = token;
                if ('company' === invoice.contractorType) {
                    return companyDao.getCompanyById(invoice.companyRecipent);
                } else if ('person' === invoice.contractorType) {
                    return personDao.getPersonById(invoice.personRecipent);
                }

            })
            .then(contractor =>
            {
                let date = new Date(invoice.createDate).toISOString().replace(/T/, ' ')
                        .replace(/\..+/, '')
                        .match(/(\d{4}-\d{2}-\d{2})/)[1];

                filename = String('EXP-' + contractor.shortcut + '-' + date + '-' + id + '.pdf');
                return googleMethods.renameFile(auth, invoice, filename);
            })
            .catch(error =>
            {
                throw applicationException.new(applicationException.ERROR, error);
            })
}

function getInvoiceNumber(year, month)
{
    return invoiceDao.getInvoiceNumber(year, month).then(number =>
    {
        if (_.isNull(number.number)) {
            number.number = 1;
        } else {
            number.number += 1;
        }
        return number;
    });
}

function changeStatus(id, status)
{
    return invoiceDao.changeStatus(id, status);
}


module.exports = {
    getInvoices, addInvoice, getInvoiceById, updateSellInvoice, getInvoiceNumber, updateBuyInvoice, changeStatus
};
