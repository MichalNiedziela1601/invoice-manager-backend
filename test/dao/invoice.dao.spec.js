'use strict';

const expect = require('chai').expect;
const invoiceDAO = require('../../app/dao/invoice.dao');
const data = require('../fixtures/invoice.dao.fixtures');
const testHelper = require('../testHelper');
const _ = require('lodash');

let invoices = [];

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
            nettoValue: '$2,330.45',
            bruttoValue: '$3,475.89',
            status: 'paid',
            url: 'url6',
            companyDealer: null,
            companyRecipent: null,
            personDealer: 1,
            personRecipent: 2
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
    })
});
