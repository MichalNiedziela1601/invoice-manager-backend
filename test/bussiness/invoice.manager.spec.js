'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;
let invoiceMock = {};
let companyDealer = {};
let companyRecipent = {};
let personDealer = {};
let personRecipent = {};
let addressDealer = {};
let addressRecipent = {};

let invoiceDAOMock = {
    getInvoices: sinon.spy(),
    addInvoice: sinon.spy(),
    getInvoiceById: sinon.stub().resolves()
};

let companyDaoMock = {
    getCompanyById: sinon.stub().resolves()
};

let addressDaoMock = {
    getAddressById: sinon.stub().resolves()
};

let personDaoMock = {
    getPersonById: sinon.stub().resolves()
};

let parserMock = {
    parseObj: sinon.spy()
};

let invoiceManager = proxyquire('../../app/business/invoice.manager', {
    '../dao/invoice.dao': invoiceDAOMock,
    '../dao/company.dao': companyDaoMock,
    '../dao/address.dao': addressDaoMock,
    '../dao/person.dao': personDaoMock,
    '../services/caleCaseParser': parserMock
});

invoiceManager.catch = sinon.stub();

describe('invoice.manager', function ()
{
    describe('getInvoices', function ()
    {
        before(function ()
        {
            return invoiceManager.getInvoices('filter');
        });
        it('should call getInvoices on invoiceDao', function ()
        {
            expect(invoiceDAOMock.getInvoices).callCount(1);
        });
        it('should call getInvoices with filter', function ()
        {
            expect(invoiceDAOMock.getInvoices).calledWith('filter');
        });
    });

    describe('addInvoice', function ()
    {
        before(function ()
        {
            return invoiceManager.addInvoice('invoice')
        });
        it('should call addInvoice on invoiceDao', function ()
        {
            expect(invoiceDAOMock.addInvoice).callCount(1);
        });
        it('should call addInvoice with invoice', function ()
        {
            expect(invoiceDAOMock.addInvoice).calledWith('invoice');
        });
    });

    describe('getInvoiceById', function ()
    {
        describe('when invoice beetween companies', function ()
        {
            before(function ()
            {
                invoiceMock = {
                    invoiceNr: 'FV/14/05/111',
                    type: 'Sale',
                    createDate: new Date('2012-05-07T22:00:00.000Z'),
                    executionEndDate: new Date('2012-01-17T23:00:00.000Z'),
                    nettoValue: '$2,330.45',
                    bruttoValue: '$3,475.89',
                    status: 'paid',
                    url: 'url6',
                    companyDealer: 1,
                    companyRecipent: 2,
                    personDealer: null,
                    personRecipent: null
                };
                companyDealer = {name: 'Firma Test 1', addressId: 1};
                companyRecipent = {name: 'Firma Test 2', addressId: 2};
                addressDealer = {id: 1, street: 'dealer'};
                addressRecipent = {id: 2, street: 'recipient'};

                invoiceDAOMock.getInvoiceById.withArgs(1).resolves(invoiceMock);
                companyDaoMock.getCompanyById.withArgs(invoiceMock.companyDealer).resolves(companyDealer);
                companyDaoMock.getCompanyById.withArgs(invoiceMock.companyRecipent).resolves(companyRecipent);
                addressDaoMock.getAddressById.withArgs(companyDealer.addressId).resolves(addressDealer);
                addressDaoMock.getAddressById.withArgs(companyRecipent.addressId).resolves(addressRecipent);
            });
            describe('always', function ()
            {

                before(function ()
                {
                    invoiceManager.getInvoiceById(1);
                });
                it('should call getInvoiceById from invoiceDao', function ()
                {
                    expect(invoiceDAOMock.getInvoiceById).callCount(1);
                });
                it('should call getInvoiceById with id', function ()
                {
                    expect(invoiceDAOMock.getInvoiceById).calledWith(1);
                });
                it('should set invoice by result', function ()
                {
                    invoiceDAOMock.getInvoiceById(1).then(result =>
                    {
                        expect(invoiceMock).to.eql(result);
                    })
                });
                it('should call twice getCompanyById', function ()
                {
                    expect(companyDaoMock.getCompanyById).callCount(2);
                });

                it('should call twice getAddressById', function ()
                {
                    expect(addressDaoMock.getAddressById).callCount(2);
                });
                it('should not call getPersonById', function ()
                {
                    expect(personDaoMock.getPersonById).callCount(0);
                });
                it('should call getCompanyById with companyDealer id', function ()
                {
                    expect(companyDaoMock.getCompanyById).calledWith(1);
                });
                it('should call getCompanyById with companyRecipent id', function ()
                {
                    expect(companyDaoMock.getCompanyById).calledWith(2);
                });
                it('should set invoice companyDealer', function ()
                {
                    companyDaoMock.getCompanyById(1).then(result =>
                    {
                        expect(invoiceMock.companyDealer).to.eql(result);
                    })
                });
                it('should set invoice companyRecipent', function ()
                {
                    companyDaoMock.getCompanyById(2).then(result =>
                    {
                        expect(invoiceMock.companyRecipent).to.eql(result);
                    })
                });
                it('should set invoice companyDealer address', function ()
                {
                    addressDaoMock.getAddressById(invoiceMock.companyDealer.addressId).then(result =>
                    {
                        expect(invoiceMock.companyDealer.address).to.eql(result);
                    })
                });
                it('should set invoice companyRecipient address', function ()
                {
                    addressDaoMock.getAddressById(invoiceMock.companyRecipent.addressId).then(result =>
                    {
                        expect(invoiceMock.companyRecipent.address).to.eql(result);
                    })
                });
            });
        });


        describe('when invoice beetween person', function ()
        {
            before(function ()
            {
                invoiceDAOMock.getInvoiceById.resetHistory();
                personDaoMock.getPersonById.resetHistory();
                addressDaoMock.getAddressById.resetHistory();
                companyDaoMock.getCompanyById.resetHistory();

                invoiceMock = {
                    invoiceNr: 'FV/14/05/111',
                    type: 'Sale',
                    createDate: new Date('2012-05-07T22:00:00.000Z'),
                    executionEndDate: new Date('2012-01-17T23:00:00.000Z'),
                    nettoValue: '$2,330.45',
                    bruttoValue: '$3,475.89',
                    status: 'paid',
                    url: 'url6',
                    personDealer: 1,
                    personRecipent: 2,
                    companyDealer: null,
                    companyRecipent: null
                };
                personDealer = {name: 'Firma Test 1', addressId: 1};
                personRecipent = {name: 'Firma Test 2', addressId: 2};
                addressDealer = {id: 1, street: 'dealer'};
                addressRecipent = {id: 2, street: 'recipient'};

                invoiceDAOMock.getInvoiceById.withArgs(2).resolves(invoiceMock);
                personDaoMock.getPersonById.withArgs(invoiceMock.personDealer).resolves(personDealer);
                personDaoMock.getPersonById.withArgs(invoiceMock.personRecipent).resolves(personRecipent);
                addressDaoMock.getAddressById.withArgs(personDealer.addressId).resolves(addressDealer);
                addressDaoMock.getAddressById.withArgs(personRecipent.addressId).resolves(addressRecipent);
            });
            describe('always', function ()
            {

                before(function ()
                {
                    invoiceManager.getInvoiceById(2);
                });
                it('should call getInvoiceById from invoiceDao', function ()
                {
                    expect(invoiceDAOMock.getInvoiceById).callCount(1);
                });
                it('should call getInvoiceById with id', function ()
                {
                    expect(invoiceDAOMock.getInvoiceById).calledWith(2);
                });
                it('should set invoice by result', function ()
                {
                    invoiceDAOMock.getInvoiceById(2).then(result =>
                    {
                        expect(invoiceMock).to.eql(result);
                    })
                });
                it('should call twice getPersonById', function ()
                {
                    expect(personDaoMock.getPersonById).callCount(2);
                });

                it('should call twice getAddressById', function ()
                {
                    expect(addressDaoMock.getAddressById).callCount(2);
                });
                it('should not call getCompanyById', function ()
                {
                    expect(companyDaoMock.getCompanyById).callCount(0);
                });
                it('should call getPersonById with personDealer id', function ()
                {
                    expect(personDaoMock.getPersonById).calledWith(1);
                });
                it('should call getPersonById with personRecipent id', function ()
                {
                    expect(personDaoMock.getPersonById).calledWith(2);
                });
                it('should set invoice personDealer', function ()
                {
                    personDaoMock.getPersonById(1).then(result =>
                    {
                        expect(invoiceMock.personDealer).to.eql(result);
                    })
                });
                it('should set invoice companyRecipent', function ()
                {
                    personDaoMock.getPersonById(2).then(result =>
                    {
                        expect(invoiceMock.personRecipent).to.eql(result);
                    })
                });
                it('should set invoice personDealer address', function ()
                {
                    addressDaoMock.getAddressById(invoiceMock.personDealer.addressId).then(result =>
                    {
                        expect(invoiceMock.personDealer.address).to.eql(result);
                    })
                });
                it('should set invoice personRecipent address', function ()
                {
                    addressDaoMock.getAddressById(invoiceMock.personRecipent.addressId).then(result =>
                    {
                        expect(invoiceMock.personRecipent.address).to.eql(result);
                    })
                });
            });
        });

    });
});
