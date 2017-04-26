'use strict';

const expect = require('chai').expect;
const invoiceDAO = require('../../app/dao/invoice.dao');
const data = require('../fixtures/invoice.dao.fixtures');
const testHelper = require('../testHelper');
const _ = require('lodash');

let invoices = [];
let invoiceById = {};
let errorMock = {};

describe('invoice.dao', function ()
{
    beforeEach(function ()
    {
        invoices = [];
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/invoice.dao.sql');
        });
    });

    function addInvalidInvoiceHelper(invalidInvoice)
    {
        return invoiceDAO.addInvoice(invalidInvoice).then(function ()
        {
            throw new Error('function then should not be served')
        }).catch(function ()
        {
            return invoiceDAO.getInvoices().then(function (result)
            {
                invoices = result;
            })
        });
    }

    describe('getInvoices', function ()
    {
        let invoices = [];
        describe('without filter', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoices().then(function (result)
                {
                    invoices = result;
                })
            });
            it('should return all invoices', function ()
            {
                expect(invoices).to.eql(data.invoices);
            });
        });
        describe('with filter', function ()
        {
            describe('sell', function ()
            {
                beforeEach(function ()
                {
                    return invoiceDAO.getInvoices({type: 'Sale'}).then(function (result)
                    {
                        invoices = result;
                    })
                });
                it('should return sell invoices', function ()
                {
                    expect(invoices).to.eql([data.invoices[1], data.invoices[2]]);
                });
            });
            describe('buy', function ()
            {
                beforeEach(function ()
                {
                    return invoiceDAO.getInvoices({type: 'Buy'}).then(function (result)
                    {
                        invoices = result;
                    })
                });
                it('should return buy companies', function ()
                {
                    expect(invoices).to.eql([data.invoices[0]]);
                });
            });
        });
    });

    describe('addInvoice', function ()
    {
        let mockedInvoice = {
            invoiceNr: 'FV/14/05/111',
            type: 'Sale',
            createDate: new Date('2012-05-07T22:00:00.000Z'),
            executionEndDate: new Date('2012-01-17T23:00:00.000Z'),
            nettoValue: '2330.45',
            bruttoValue: '3475.89',
            status: 'paid',
            url: 'url6',
            companyDealer: null,
            companyRecipent: null,
            personDealer: 1,
            personRecipent: 2,
            googleMonthFolderId: null,
            googleYearFolderId: null,
            description: null
        };

        let mockedInvoiceId = {id: 4};
        _.assign(mockedInvoiceId, mockedInvoice);

        describe('properties are valid', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.addInvoice(mockedInvoice).then(function ()
                {
                    return invoiceDAO.getInvoices().then(function (result)
                    {
                        invoices = result;
                    })
                });
            });
            it('should add new invoice', function ()
            {
                expect(invoices[3]).to.eql(mockedInvoiceId)
            });
        });

        describe('properties is invalid', function ()
        {
            describe('invoice number is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['invoiceNr']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('type is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['type']);
                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('createDate is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['createDate']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if createDate is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('executionEndDate is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['executionEndDate']);
                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if executionEndDate is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('nettoValue is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['nettoValue']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if nettoValue is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('bruttoValue is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['bruttoValue']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if bruttoValue is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('status is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['status']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if status is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('url is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['url']);

                beforeEach(function ()
                {
                    return addInvalidInvoiceHelper(invalidInvoice);
                });

                it('should not add invoice if url is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });
        })
    });

    describe('getInvoiceById', function ()
    {
        describe('when invoice exist', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceById(1).then(function (result)
                {
                    invoiceById = result;
                })
            });
            it('should return invoice by id', function ()
            {
                expect(invoiceById).to.eql(data.invoices[0]);
            });
        });
        describe('when invoice not found', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceById(7).catch(error =>
                {
                    errorMock = error;
                })
            });
            it('should throw error', function ()
            {
                expect(errorMock).eql({
                    error: {message: 'NOT_FOUND', code: 404},
                    message: 'Invoice not found'
                })
            });
        });
    });

    describe('updateInvoice', function ()
    {
        let mockedInvoice = {
            invoiceNr: 'FV/14/05/111',
            type: 'Sale',
            createDate: new Date('2012-05-07T22:00:00.000Z'),
            executionEndDate: new Date('2012-01-17T23:00:00.000Z'),
            nettoValue: '2430.45',
            bruttoValue: '3675.89',
            status: 'paid'
        };
        describe('when properties valid', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.updateInvoice(mockedInvoice, 1).then(() =>
                {
                    return invoiceDAO.getInvoiceById(1).then(invoice =>
                    {
                        invoiceById = invoice;
                    })
                })
            });
            it('should set new invoice', function ()
            {
                expect(invoiceById).eql(data.afterUpdateInvoice);
            });
        });

        describe('when invoiceNr is invalid', function ()
        {
            let invalidInvoice = _.omit(mockedInvoice, ['invoiceNr']);
            beforeEach(function ()
            {
                return invoiceDAO.updateInvoice(invalidInvoice, 1).catch(error =>
                {
                    errorMock = error;
                })
            });
            it('should throw error', function ()
            {
                expect(errorMock.error).eql({message: 'ERROR', code: 500})
            });
        });
    });
});
