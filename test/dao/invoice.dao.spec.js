'use strict';

const expect = require('chai').expect;
const invoiceDAO = require('../../app/dao/invoice.dao');
const data = require('../fixtures/invoice.dao.fixtures');
const testHelper = require('../testHelper');
const _ = require('lodash');

describe('invoice.dao', function ()
{
    beforeEach(function ()
    {
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/invoice.dao.sql');
        });
    });

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
            personDealer: '1',
            personRecipent: '2'
        };

        let mockedInvoiceId = {id: 4};
        _.assign(mockedInvoiceId, mockedInvoice);
        let invoices = [];

        describe('if properties are valid', function ()
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

        describe('if properties are invalid', function ()
        {
            describe('if invoice number is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['invoiceNr']);

                beforeEach(function ()
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
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if type is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['type']);
                beforeEach(function ()
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
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if createDate is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['createDate']);

                beforeEach(function ()
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
                });

                it('should not add invoice if createDate is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if executionEndDate is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['executionEndDate']);
                beforeEach(function ()
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
                });

                it('should not add invoice if executionEndDate is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if nettoValue is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['nettoValue']);

                beforeEach(function ()
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
                });

                it('should not add invoice if nettoValue is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if bruttoValue is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['bruttoValue']);

                beforeEach(function ()
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
                });

                it('should not add invoice if bruttoValue is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if status is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['status']);

                beforeEach(function ()
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
                });

                it('should not add invoice if status is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });

            describe('if url is null', function ()
            {
                let invalidInvoice = _.omit(mockedInvoice, ['url']);

                beforeEach(function ()
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
                });

                it('should not add invoice if url is invalid', function ()
                {
                    expect(invoices).to.eql(data.invoices)
                });
            });
        })
    })
});