'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);
const applicationException = require('../../app/services/applicationException');
const invoceFixtures = require('../fixtures/invoice.manager.fixtures');
const _ = require('lodash');

const expect = chai.expect;
let invoiceMock = {};
let companyDealer = {};
let companyRecipent = {};
let personDealer = {};
let personRecipent = {};
let addressDealer = {};
let addressRecipent = {};

let invoiceDAOMock = {
    getInvoices: sinon.stub(),
    addInvoice: sinon.spy(),
    getInvoiceById: sinon.stub().resolves(),
    getInvoiceFullNumber: sinon.stub(),
    getInvoiceNumber: sinon.stub(),
    updateInvoice: sinon.spy(),
    changeStatus: sinon.spy()
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

let oauthTokenMock = sinon.stub().resolves('token');
let googleMethodsMock = {
    createFolder: sinon.stub().resolves(),
    createChildFolder: sinon.stub().resolves(),
    saveFile: sinon.stub(),
    shareFile: sinon.stub(),
    deleteFile: sinon.stub()
};

let createFoldersGoogleMock = {
    createYearMonthFolder: sinon.stub().resolves(),
    createFolderCompany: sinon.stub().resolves()
};


let invoiceManager = proxyquire('../../app/business/invoice.manager', {
    '../dao/invoice.dao': invoiceDAOMock,
    '../dao/company.dao': companyDaoMock,
    '../dao/address.dao': addressDaoMock,
    '../dao/person.dao': personDaoMock,
    '../services/googleApi': oauthTokenMock,
    '../services/google.methods': googleMethodsMock,
    '../services/createFoldersGoogle': createFoldersGoogleMock
});


invoiceManager.catch = sinon.stub();

describe('invoice.manager', function ()
{
    describe('getInvoices', function ()
    {
        let filter = {};
        let invoices = [];
        describe('when type is sell', function ()
        {
            before(function ()
            {
                invoiceDAOMock.getInvoices.resolves(invoceFixtures.getInvoicesSell);
                companyDaoMock.getCompanyById.resolves(invoceFixtures.getCompanyById);
                filter.type = 'sell';
                return invoiceManager.getInvoices(filter,2).then(result => {
                    invoices = result;
                });
            });
            it('should call getInvoices on invoiceDao', function ()
            {
                expect(invoiceDAOMock.getInvoices).callCount(1);
            });
            it('should call getInvoices with filter', function ()
            {
                expect(invoiceDAOMock.getInvoices).calledWith(filter,2);
            });
            it('should call getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(2);
                expect(companyDaoMock.getCompanyById).calledWith(1);
                expect(companyDaoMock.getCompanyById).calledWith(3);
            });
            it('should return invoices', function ()
            {
                let result = invoceFixtures.getInvoicesSell;
                _.each(result, value => {
                    value.companyRecipent = invoceFixtures.getCompanyById;
                });
                expect(invoices).eql(result);
            });
        });
        describe('when type is buy', function ()
        {
            before(function ()
            {
                invoiceDAOMock.getInvoices.reset();
                companyDaoMock.getCompanyById.reset();
                invoiceDAOMock.getInvoices.resolves(invoceFixtures.getInvoicesBuy);
                companyDaoMock.getCompanyById.resolves(invoceFixtures.getCompanyById);
                filter.type = 'buy';
                return invoiceManager.getInvoices(filter,2).then(result => {
                    invoices = result;
                });
            });
            it('should call getInvoices on invoiceDao', function ()
            {
                expect(invoiceDAOMock.getInvoices).callCount(1);
            });
            it('should call getInvoices with filter', function ()
            {
                expect(invoiceDAOMock.getInvoices).calledWith(filter,2);
            });
            it('should call getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(2);
                expect(companyDaoMock.getCompanyById).calledWith(1);
                expect(companyDaoMock.getCompanyById).calledWith(3);
            });
            it('should return invoices', function ()
            {
                let result = invoceFixtures.getInvoicesBuy;
                _.each(result, value => {
                    value.companyDealer = invoceFixtures.getCompanyById;
                });
                expect(invoices).eql(result);
            });
        });
    });

    describe('addInvoice', function ()
    {
        describe('when getInvoiceFullNumber', function ()
        {
            let yearId = 'sdf897sfdsk';
            let monthId = 'hku4h5uik4';
            let response = {
                id: 'sdfhshs45j3h',
                webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
            };
            before(function ()
            {
                companyDaoMock.getCompanyById.reset();

                invoiceMock = {
                    invoiceNr: 'FV 12/05/111',
                    type: 'sell',
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
                invoiceDAOMock.getInvoiceFullNumber.resolves();
                googleMethodsMock.shareFile.resolves();
                googleMethodsMock.saveFile.resolves(response);
                createFoldersGoogleMock.createFolderCompany.withArgs('token', invoiceMock.companyRecipent).resolves(yearId);
                createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoiceMock, yearId).resolves(monthId);

                invoiceManager.addInvoice('filename', invoiceMock)
            });
            it('should call getInvoiceFullNumber', function ()
            {
                expect(invoiceDAOMock.getInvoiceFullNumber).callCount(1);
                expect(invoiceDAOMock.getInvoiceFullNumber).calledWith(2012, 5, 111);
            });
            it('should call oauthToken', function ()
            {
                expect(oauthTokenMock).callCount(1);
            });
            it('should call createFolderCompany', function ()
            {
                expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 2);
            });
            it('should call createYearMonthFolder', function ()
            {
                expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoiceMock, yearId);
            });
            it('should call saveFile', function ()
            {
                expect(googleMethodsMock.saveFile, 'call saveFile').callCount(1);
            });
            it('should call shareFile', function ()
            {

                expect(googleMethodsMock.shareFile).callCount(1);
                expect(googleMethodsMock.shareFile).calledWith('token', response.id);

            });
            it('should call addInvoice', function ()
            {

                expect(invoiceDAOMock.addInvoice).callCount(1);
                expect(invoiceDAOMock.addInvoice).calledWith(invoiceMock)

            });
        });
        describe('when getInvoiceFullNumber found number', function ()
        {
            before(() =>
            {
                invoiceMock = {
                    invoiceNr: 'FV 12/05/111',
                    type: 'buy',
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
                invoiceDAOMock.getInvoiceFullNumber.reset();
                invoiceDAOMock.getInvoiceFullNumber.rejects(
                        applicationException.new(applicationException.CONFLICT, 'This invoice number exists. Try another!'));

            });
            it('should throw error CONFLICT', function ()
            {
                invoiceManager.addInvoice('filename', invoiceMock).catch(error =>
                {
                    expect(error).eql({
                        error: {message: 'CONFLICT', code: 409},
                        message: 'This invoice number exists. Try another!'
                    })
                })
            });
        });

        describe('when upload invoice', function ()
        {
            let yearId = 'sdf897sfdsk';
            let monthId = 'hku4h5uik4';
            let response = {
                id: 'sdfhshs45j3h',
                webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
            };
            before(() => {
                companyDaoMock.getCompanyById.reset();

                invoiceMock = {
                    invoiceNr: 'FV 12/05/111',
                    type: 'buy',
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
                invoiceDAOMock.getInvoiceFullNumber.resolves();
                googleMethodsMock.shareFile.resolves();
                googleMethodsMock.saveFile.resolves(response);
                createFoldersGoogleMock.createFolderCompany.withArgs('token', invoiceMock.companyDealer).resolves(yearId);
                createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoiceMock, yearId).resolves(monthId);

                invoiceManager.addInvoice('filename', invoiceMock)
            });
            it('should call createFolderCompany with args', function ()
            {
                expect(createFoldersGoogleMock.createFolderCompany).calledWith('token',1);
            });
        });

        describe('when something wrong', function ()
        {
            before(() =>
            {
                invoiceMock = {
                    invoiceNr: 'FV 12/05/111',
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
                invoiceDAOMock.getInvoiceFullNumber.reset();
                invoiceDAOMock.getInvoiceFullNumber.rejects();

            });
            it('should throw error', function ()
            {
                invoiceManager.addInvoice('filename', invoiceMock).catch(error =>
                {
                    expect(error.error).eql({message: 'ERROR', code: 500})
                })
            });
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

                companyDaoMock.getCompanyById.reset();
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
        describe('when error occured', function ()
        {

            before(function ()
            {
                invoiceDAOMock.getInvoiceById.resetHistory();
                personDaoMock.getPersonById.resetHistory();
                addressDaoMock.getAddressById.resetHistory();
                companyDaoMock.getCompanyById.resetHistory();

                invoiceDAOMock.getInvoiceById.rejects();
            });
            it('should throw error 500', function ()
            {
                invoiceManager.getInvoiceById(2).catch(error =>
                {
                    expect(error.error).eql({message: 'ERROR', code: 500});
                })
            });
        });
    });

    describe('updateBuyInvoice', function ()
    {
        before(() =>
        {
            invoiceMock = {
                invoiceNr: 'FV 2012/5/33'
            };

            invoiceManager.updateBuyInvoice(invoiceMock, 2);
        });
        it('should call invoiceDao.updateInvoice', function ()
        {
            expect(invoiceDAOMock.updateInvoice).callCount(1);
            expect(invoiceDAOMock.updateInvoice).calledWith(invoiceMock, 2);
        });
    });

    describe('getInvoiceNumber', function ()
    {
        let number = {};
        describe('when find number', function ()
        {
            before(() =>
            {
                invoiceDAOMock.getInvoiceNumber.resolves({number: 1});
                return invoiceManager.getInvoiceNumber().then(result =>
                {
                    number = result;
                })

            });
            it('should return number increased by 1', function ()
            {
                expect(number).to.deep.equal({number: 2});
            });
        });
        describe('when not find number', function ()
        {
            before(() =>
            {
                invoiceDAOMock.getInvoiceNumber.reset();
                invoiceDAOMock.getInvoiceNumber.resolves({number: null});
                return invoiceManager.getInvoiceNumber().then(result =>
                {
                    number = result;
                })
            });
            it('should return number incrased by 1', function ()
            {
                expect(number).eql({number: 1});
            });
        });
    });

    describe('updateSellInvoice', function ()
    {
        invoiceMock = {
            invoiceNr: 'FV 12/05/111',
            type: 'Sale',
            createDate: new Date('2012-05-08'),
            executionEndDate: new Date('2012-01-18'),
            nettoValue: '$2,330.45',
            bruttoValue: '$3,475.89',
            status: 'paid',
            companyDealer: 1,
            companyRecipent: 2,
            personDealer: null,
            personRecipent: null
        };
        describe('when success', function ()
        {
            let yearId = 'sdf897sfdsk';
            let monthId = 'hku4h5uik4';
            let response = {
                id: 'sdfhshs45j3h',
                webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
            };
            before(() =>
            {

                oauthTokenMock.reset();
                oauthTokenMock.resolves('token');
                googleMethodsMock.saveFile.reset();
                googleMethodsMock.shareFile.reset();
                createFoldersGoogleMock.createFolderCompany.reset();
                createFoldersGoogleMock.createYearMonthFolder.reset();
                invoiceDAOMock.updateInvoice.reset();
                googleMethodsMock.shareFile.resolves();
                googleMethodsMock.saveFile.resolves(response);
                createFoldersGoogleMock.createFolderCompany.withArgs('token', invoiceMock.companyRecipent).resolves(yearId);
                createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoiceMock, yearId).resolves(monthId);

                invoiceManager.updateSellInvoice(invoiceMock, 1, 'file.pdf');

            });
            it('should call oauthToken', function ()
            {
                expect(oauthTokenMock).callCount(1);
            });
            it('should call deleteFile', function ()
            {
                expect(googleMethodsMock.deleteFile).callCount(1);
                expect(googleMethodsMock.deleteFile).calledWith('token', invoiceMock);
            });
            it('should call createFolderCompany', function ()
            {
                expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', invoiceMock.companyRecipent);
            });
            it('should call createFolderYearMonthFolder', function ()
            {
                expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoiceMock, yearId);
            });
            it('should call saveFile', function ()
            {
                expect(googleMethodsMock.saveFile).callCount(1);
            });
            it('should call shareFile', function ()
            {

                expect(googleMethodsMock.shareFile).callCount(1);
                expect(googleMethodsMock.shareFile).calledWith('token', response.id);
            });
            it('should call updateInvoice', function ()
            {
                expect(invoiceDAOMock.updateInvoice).callCount(1);
                expect(invoiceDAOMock.updateInvoice).calledWith(invoiceMock, 1);
            });
        });

        describe('when unknown error occurred', function ()
        {
            let update = {};
            before(() =>
            {
                googleMethodsMock.deleteFile.rejects();
                return invoiceManager.updateSellInvoice(invoiceMock, 1, 'file.pdf')
                        .catch(error =>
                        {
                            update = error;
                        });

            });
            it('should throw error', function ()
            {
                expect(update.error).eql({message: 'ERROR', code: 500})
            });
        });
        describe('when known error occured', function ()
        {
            let update = {};
            before(() => {
                googleMethodsMock.deleteFile.rejects(applicationException.new(404,'FILE NOT FOUND'));
                return invoiceManager.updateSellInvoice(invoiceMock,1,'file.pdf').catch(error => {
                    update = error;
                })
            });
            it('should throw error', function ()
            {
                expect(update).eql({ error: 404, message: 'FILE NOT FOUND' });
            });
        });
    });

    describe('changeStatus', function ()
    {
        before(() => {
            invoiceManager.changeStatus(1,'paid');
        });
        it('should call changeStatus', function ()
        {
            expect(invoiceDAOMock.changeStatus).callCount(1);
            expect(invoiceDAOMock.changeStatus).calledWith(1,'paid');
        });
    });

});
