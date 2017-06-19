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
                    return invoiceDAO.getInvoices({type: 'sell'},2).then(function (result)
                    {
                        invoices = result;
                    })
                });
                it('should return sell invoices', function ()
                {
                    expect(invoices).to.eql([data.invoices[1]]);
                });
            });
            describe('buy', function ()
            {
                beforeEach(function ()
                {
                    return invoiceDAO.getInvoices({type: 'buy'},2).then(function (result)
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
            invoiceNr: 'FV 2014/05/111',
            type: 'sell',
            createDate: new Date('2012-05-08'),
            executionEndDate: new Date('2012-01-18'),
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
            description: null,
            year: 2014,
            month: 5,
            number: 111,
            products: null,
            paymentMethod: 'transfer',
            advance: null,
            currency: null,
            fileId: null,
            language: null,
            contractorType: null,
            reverseCharge: null,
            dealerAccountNr: null,
            recipentAccountNr: null
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
            invoiceNr: 'FV 2014/05/111',
            type: 'sell',
            createDate: new Date('2012-05-08'),
            executionEndDate: new Date('2012-01-18'),
            nettoValue: '2430.45',
            bruttoValue: '3675.89',
            status: 'paid',
            year: 2012,
            month: 2,
            number: 2,
            url: 'url1',
            companyDealer: 1,
            companyRecipent: 2,
            personDealer: null,
            personRecipent: null,
            googleMonthFolderId: null,
            googleYearFolderId: null,
            description: null,
            products: null,
            paymentMethod: 'bank transfer',
            advance: null,
            currency: null,
            fileId: null,
            language: null,
            dealerAccountNr: '1',
            recipentAccountNr: null
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

    describe('getInvoiceNumber', function ()
    {
        let number = {};
        describe('when find max', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceNumber({year: 2012, month: 2, type: 'buy', companyId: 2}).then(result => {
                    number = result;
                })
            });
            it('should return max', function ()
            {
                expect(number).eql({number: 2});
            });
        });

        describe('when not find max', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceNumber({year: 2012, month: 3, type: 'buy', companyId: 2}).then(result => {
                    number = result;
                })
            });
            it('should return max', function ()
            {
                expect(number).eql({number: null});
            });
        });
    });

    describe('getInvoiceFullNumber', function ()
    {
        describe('when find number', function ()
        {
            let error = {};
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceFullNumber({year: 2012, month: 2, number: 2, type: 'buy'},2).catch(result => {
                    error = result;
                })
            });
            it('should throw error', function ()
            {
                expect(error).eql({
                    error: {message: 'CONFLICT', code: 409},
                    message: 'This invoice number exists. Try another!'});
            });
        });
        describe('when not find invoice', function ()
        {
            let id = {};
            beforeEach(function ()
            {
                return invoiceDAO.getInvoiceFullNumber({year: 2012, month: 2, number: 4, type: 'buy'},2).then(result => {
                    id = result;
                })
            });
            it('should return null', function ()
            {
                expect(id).eql(null);
            });
        });
    });

    describe('changeStatus', function ()
    {
        let result = {};
        beforeEach(function ()
        {
            return invoiceDAO.changeStatus(1,'paid').then(() => {
                return invoiceDAO.getInvoiceById(1).then(invoice => {
                    result = invoice;
                })
            })
        });
        it('should change status to paid', function ()
        {
            expect(result.status).eql('paid');
        });
    });

    describe('deleteInvoice', function ()
    {
        let result = {};
        beforeEach(function ()
        {
            return invoiceDAO.deleteInvoice(1).then(() => {
                return invoiceDAO.getInvoices().then(invoices => {
                    result = invoices;
                });
            });
        });
        it('should remove invoice', function ()
        {
            expect(result).eql(data.invoicesAfterDelete);
        });
    });
});
