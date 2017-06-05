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
const invoiceMock = {
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
    personRecipent: null,
    contractorType: 'company'
};
let companyDealer = {};
let companyRecipent = {};
let personDealer = {};
let personRecipent = {};
let addressDealer = {};
let addressRecipent = {};
let company = {};
let invoice = {};

let invoiceDAOMock = {
    getInvoices: sinon.stub(),
    addInvoice: sinon.stub(),
    getInvoiceById: sinon.stub().resolves(),
    getInvoiceFullNumber: sinon.stub(),
    getInvoiceNumber: sinon.stub(),
    updateInvoice: sinon.stub().resolves(),
    changeStatus: sinon.spy(),
    deleteInvoice: sinon.stub().resolves()
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
    deleteFile: sinon.stub(),
    renameFile: sinon.stub()
};

let createFoldersGoogleMock = {
    createYearMonthFolder: sinon.stub(),
    createFolderCompany: sinon.stub().resolves()
};

let writeStreamMock = sinon.spy();
let mkdirMock = sinon.spy();
let fs = {
    mkdirSync: mkdirMock,
    createWriteStream: writeStreamMock
};
let pdfGeneratorMock = sinon.stub();
let endMock = sinon.stub();
let pipeMock = sinon.stub();
let createPdfKitDocumentMock = sinon.spy(() =>
{
    return {
        end: endMock,
        pipe: pipeMock
    }
});

let data = {

    pipe: sinon.stub().returns({on: sinon.stub().yields()})
};

let pdfMakePrinterMock = sinon.spy(function ()
{
    return {
        createPdfKitDocument: createPdfKitDocumentMock
    }
});


let person = {};

let invoiceManager = proxyquire('../../app/business/invoice.manager', {
    '../dao/invoice.dao': invoiceDAOMock,
    '../dao/company.dao': companyDaoMock,
    '../dao/address.dao': addressDaoMock,
    '../dao/person.dao': personDaoMock,
    '../services/googleApi': oauthTokenMock,
    '../services/google.methods': googleMethodsMock,
    '../services/createFoldersGoogle': createFoldersGoogleMock,
    './pdfContent': pdfGeneratorMock,
    'pdfmake/src/printer': pdfMakePrinterMock,
    'fs': fs

});

function reset()
{
    invoiceDAOMock.getInvoices.reset();
    invoiceDAOMock.addInvoice.reset();
    invoiceDAOMock.getInvoiceById.reset();
    invoiceDAOMock.getInvoiceFullNumber.reset();
    invoiceDAOMock.getInvoiceNumber.reset();
    invoiceDAOMock.updateInvoice.reset();
    invoiceDAOMock.changeStatus.reset();
    invoiceDAOMock.deleteInvoice.reset();

    addressDaoMock.getAddressById.reset();

    companyDaoMock.getCompanyById.reset();

    personDaoMock.getPersonById.reset();

    googleMethodsMock.createChildFolder.reset();
    googleMethodsMock.shareFile.reset();
    googleMethodsMock.saveFile.reset();
    googleMethodsMock.createFolder.reset();
    googleMethodsMock.renameFile.reset();
    googleMethodsMock.deleteFile.reset();

    createFoldersGoogleMock.createFolderCompany.reset();
    createFoldersGoogleMock.createYearMonthFolder.reset();
    pipeMock.reset();
    writeStreamMock.reset();
    pdfGeneratorMock.reset();
    pdfMakePrinterMock.reset();
    oauthTokenMock.reset();
    endMock.reset();
    fs.mkdirSync.reset();
    fs.createWriteStream.reset();
    createPdfKitDocumentMock.reset();
}


invoiceManager.catch = sinon.stub();

describe('invoice.manager', function ()
{
    describe('getInvoices', function ()
    {
        let filter = {};
        let invoices = [];
        describe('when type is sell', function ()
        {
            describe('when companyRecipent is not null', function ()
            {
                before(function ()
                {
                    reset();
                    invoiceDAOMock.getInvoices.resolves(invoceFixtures.getInvoicesSell);
                    companyDaoMock.getCompanyById.resolves(invoceFixtures.getCompanyById);
                    filter.type = 'sell';
                    return invoiceManager.getInvoices(filter, 2).then(result =>
                    {
                        invoices = result;
                    });
                });
                it('should call getInvoices on invoiceDao', function ()
                {
                    expect(invoiceDAOMock.getInvoices).callCount(1);
                });
                it('should call getInvoices with filter', function ()
                {
                    expect(invoiceDAOMock.getInvoices).calledWith(filter, 2);
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
                    _.each(result, value =>
                    {
                        value.companyRecipent = invoceFixtures.getCompanyById;
                    });
                    expect(invoices).eql(result);
                });
            });
            describe('when personRecipient not null', function ()
            {

                before(function ()
                {
                    reset();
                    invoiceDAOMock.getInvoices.resolves(invoceFixtures.getInvoicesSell2);
                    companyDaoMock.getCompanyById.resolves(invoceFixtures.getCompanyById);
                    personDaoMock.getPersonById.resolves(invoceFixtures.getPersonById);
                    filter.type = 'sell';
                    return invoiceManager.getInvoices(filter, 2).then(result =>
                    {
                        invoices = result;
                    });
                });
                it('should call getInvoices on invoiceDao', function ()
                {
                    expect(invoiceDAOMock.getInvoices).callCount(1);
                });
                it('should call getInvoices with filter', function ()
                {
                    expect(invoiceDAOMock.getInvoices).calledWith(filter, 2);
                });
                it('should call getCompanyById', function ()
                {
                    expect(companyDaoMock.getCompanyById).callCount(1);
                    expect(companyDaoMock.getCompanyById).calledWith(1);
                });
                it('should call getPersonById', function ()
                {
                    expect(personDaoMock.getPersonById).callCount(1);
                    expect(personDaoMock.getPersonById).calledWith(3)
                });
                it('should return invoices', function ()
                {
                    let result = invoceFixtures.getInvoicesSell2;
                    _.each(result, value =>
                    {
                        value.companyRecipent = invoceFixtures.getCompanyById;
                    });
                    expect(invoices).eql(result);
                });
            });
        });
        describe('when type is buy', function ()
        {
            before(function ()
            {
                reset();
                invoiceDAOMock.getInvoices.resolves(invoceFixtures.getInvoicesBuy);
                companyDaoMock.getCompanyById.resolves(invoceFixtures.getCompanyById);
                personDaoMock.getPersonById.resolves(invoceFixtures.getPersonById);
                filter.type = 'buy';
                return invoiceManager.getInvoices(filter, 2).then(result =>
                {
                    invoices = result;
                });
            });
            it('should call getInvoices on invoiceDao', function ()
            {
                expect(invoiceDAOMock.getInvoices).callCount(1);
            });
            it('should call getInvoices with filter', function ()
            {
                expect(invoiceDAOMock.getInvoices).calledWith(filter, 2);
            });
            it('should call getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(1);
                expect(companyDaoMock.getCompanyById).calledWith(3);
            });
            it('should call getPersonById', function ()
            {
                expect(personDaoMock.getPersonById).callCount(1);
                expect(personDaoMock.getPersonById).calledWith(3);
            });
            it('should return invoices', function ()
            {
                let result = invoceFixtures.getInvoicesBuy;
                _.each(result, value =>
                {
                    value.companyDealer = invoceFixtures.getCompanyById;
                });
                expect(invoices).eql(result);
            });
        });

        describe('when error occurred', function ()
        {
            before(() =>
            {
                invoiceDAOMock.getInvoices.reset();
                companyDaoMock.getCompanyById.reset();
                personDaoMock.getPersonById.reset();
                invoiceDAOMock.getInvoices.rejects();
                filter.type = 'buy';
                return invoiceManager.getInvoices(filter, 2).catch(result =>
                {
                    invoices = result;
                });
            });
            it('should catch error', function ()
            {
                expect(invoices).eql({error: {code: 500, message: 'ERROR'}, message: 'Something bad with getInvoices'})
            });

        });
    });

    describe('addInvoice', function ()
    {
        let yearId = {};
        let monthId = 'hku4h5uik4';
        let response = {
            id: 'sdfhshs45j3h',
            webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
        };

        describe('sell invoice', function ()
        {
            describe('when getInvoiceFullNumber not found number', function ()
            {
                describe('when contractorType is company', function ()
                {
                    before(function ()
                    {
                        reset();
                        yearId = {company: {shortcut: 'FIRMA_RKR'}, foldrId: 'sdf897sfdsk'};
                        invoice = _.cloneDeep(invoiceMock);


                        company = {
                            name: 'Firma',
                            nip: 1234567890,
                            id: 2,
                            shortcut: 'FIRMA_RKR'
                        };
                        oauthTokenMock.resolves('token');
                        invoiceDAOMock.getInvoiceFullNumber.resolves();
                        googleMethodsMock.shareFile.resolves();
                        googleMethodsMock.saveFile.resolves(response);
                        createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyDealer).resolves(yearId);
                        createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                        invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                        companyDaoMock.getCompanyById.resolves(company);
                        pdfGeneratorMock.resolves('pdf content');
                        pipeMock.returns({on: sinon.stub().yields()});
                        invoiceDAOMock.updateInvoice.resolves();
                        invoiceManager.addInvoice(null, invoice, 1)
                    });

                    it('should call getInvoiceFullNumber', function ()
                    {
                        expect(invoiceDAOMock.getInvoiceFullNumber).callCount(1);
                        expect(invoiceDAOMock.getInvoiceFullNumber).calledWith(invoice,1);
                    });
                    it('should call addInvoice', function ()
                    {

                        expect(invoiceDAOMock.addInvoice).callCount(1);
                        expect(invoiceDAOMock.addInvoice).calledWith(invoice);

                    });
                    it('should call getCompanyById', function ()
                    {
                        expect(companyDaoMock.getCompanyById).callCount(1);
                        expect(companyDaoMock.getCompanyById).calledWith(2)
                    });
                    it('should call pdfGenerator', function ()
                    {
                        expect(pdfGeneratorMock).callCount(1);
                        expect(pdfGeneratorMock).calledWith(invoice);
                    });
                    it('should create new directory', function ()
                    {
                        expect(fs.mkdirSync).callCount(1);
                    });
                    it('should call new PdfMakePrinter', function ()
                    {
                        expect(pdfMakePrinterMock).callCount(1);
                    });
                    it('should call createPefKitDocument', function ()
                    {
                        expect(createPdfKitDocumentMock).callCount(1);
                    });
                    it('should call fs.createWriteStream', function ()
                    {
                        expect(writeStreamMock).callCount(1);
                    });

                    it('should call pipe', function ()
                    {
                        expect(pipeMock).callCount(1);
                    });
                    it('should call end', function ()
                    {
                        expect(endMock).callCount(1);
                    });

                    it('should call oauthToken', function ()
                    {
                        expect(oauthTokenMock).callCount(1);
                    });
                    it('should call createFolderCompany', function ()
                    {
                        expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                        expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
                    });
                    it('should call createYearMonthFolder', function ()
                    {
                        expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                        expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoice, yearId);
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
                    it('should call updateInvoice', function ()
                    {
                        expect(invoiceDAOMock.updateInvoice).callCount(1);
                        expect(invoiceDAOMock.updateInvoice).calledWith(invoice, 4);
                    });
                });

                describe('when contractorType is person', function ()
                {
                    before(function ()
                    {
                        reset();
                        yearId = {company: {shortcut: 'SMITHJOHN'}, foldrId: 'sdf897sfdsk'};

                        invoice = _.cloneDeep(invoiceMock);
                        invoice.companyDealer = 1;
                        invoice.companyRecipent = null;
                        invoice.personDealer = null;
                        invoice.personRecipent = 2;
                        invoice.contractorType = 'person';

                        person = {
                            firstName: 'John',
                            lastName: 'Smith',
                            nip: 1234567890,
                            id: 2,
                            shortcut: 'SMITHJOHN'
                        };

                        pdfGeneratorMock.resolves('something');
                        invoiceDAOMock.getInvoiceFullNumber.resolves();
                        oauthTokenMock.resolves('token');
                        googleMethodsMock.shareFile.resolves();
                        googleMethodsMock.saveFile.resolves(response);
                        createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyDealer).resolves(yearId);
                        createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                        invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                        personDaoMock.getPersonById.resolves(person);
                        pipeMock.returns({on: sinon.stub().yields()});
                        invoiceDAOMock.updateInvoice.resolves();
                        invoiceManager.addInvoice(null, invoice, 1)
                    });
                    it('should call getInvoiceFullNumber', function ()
                    {
                        expect(invoiceDAOMock.getInvoiceFullNumber).callCount(1);
                        expect(invoiceDAOMock.getInvoiceFullNumber).calledWith(invoice,1);
                    });
                    it('should call addInvoice', function ()
                    {

                        expect(invoiceDAOMock.addInvoice).callCount(1);
                        expect(invoiceDAOMock.addInvoice).calledWith(invoice);

                    });
                    it('should call getPersonById', function ()
                    {
                        expect(personDaoMock.getPersonById).callCount(1);
                        expect(personDaoMock.getPersonById).calledWith(2)
                    });
                    it('should create new directory', function ()
                    {
                        expect(fs.mkdirSync).callCount(1);
                    });
                    it('should call createPefKitDocument', function ()
                    {
                        expect(createPdfKitDocumentMock).callCount(1);
                    });
                    it('should call fs.createWriteStream', function ()
                    {
                        expect(writeStreamMock).callCount(1);
                    });

                    it('should call pipe', function ()
                    {
                        expect(pipeMock).callCount(1);
                    });
                    it('should call end', function ()
                    {
                        expect(endMock).callCount(1);
                    });

                    it('should call oauthToken', function ()
                    {
                        expect(oauthTokenMock).callCount(1);
                    });
                    it('should call createFolderCompany', function ()
                    {
                        expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                        expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
                    });
                    it('should call createYearMonthFolder', function ()
                    {
                        expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                        expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token');
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
                    it('should call updateInvoice', function ()
                    {
                        expect(invoiceDAOMock.updateInvoice).callCount(1);
                        expect(invoiceDAOMock.updateInvoice).calledWith(invoice, 4);
                    });
                });


            });
            describe('when getInvoiceFullNumber found number', function ()
            {
                before(() =>
                {
                    reset();

                    invoice = _.cloneDeep(invoiceMock);
                    invoiceDAOMock.getInvoiceFullNumber.rejects(
                            applicationException.new(applicationException.CONFLICT, 'This invoice number exists. Try another!'));

                });
                it('should throw error CONFLICT', function ()
                {
                    invoiceManager.addInvoice('filename', invoice).catch(error =>
                    {
                        expect(error).eql({
                            error: {message: 'CONFLICT', code: 409},
                            message: 'This invoice number exists. Try another!'
                        })
                    })
                });
            });
        });


        describe('buy invoice', function ()
        {
            describe('when contractorType is person', function ()
            {
                before(function ()
                {
                    reset();
                    yearId = {company: {shortcut: 'FIRMA_RKR'}, foldrId: 'sdf897sfdsk'};
                    invoice = _.cloneDeep(invoiceMock);
                    invoice.type = 'buy';
                    invoice.companyDealer = null;
                    invoice.companyRecipent = 1;
                    invoice.personDealer = 2;
                    invoice.personRecipent = null;
                    invoice.contractorType = 'person';

                    company = {
                        name: 'Firma',
                        nip: 1234567890,
                        id: 2,
                        shortcut: 'FIRMA_RKR'
                    };
                    oauthTokenMock.resolves('token');
                    invoiceDAOMock.getInvoiceFullNumber.resolves();
                    googleMethodsMock.shareFile.resolves();
                    googleMethodsMock.saveFile.resolves(response);
                    createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyRecipent).resolves(yearId);
                    createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                    invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                    personDaoMock.getPersonById.resolves(company);
                    invoiceDAOMock.updateInvoice.resolves();
                    pipeMock.returns({on: sinon.stub().yields()});

                    invoiceManager.addInvoice(data, invoice, 1)
                });

                it('should call getInvoiceFullNumber', function ()
                {
                    expect(invoiceDAOMock.getInvoiceFullNumber).callCount(1);
                    expect(invoiceDAOMock.getInvoiceFullNumber).calledWith(invoice,1);
                });
                it('should call addInvoice', function ()
                {

                    expect(invoiceDAOMock.addInvoice).callCount(1);
                    expect(invoiceDAOMock.addInvoice).calledWith(invoice);

                });
                it('should call getPersonById', function ()
                {
                    expect(personDaoMock.getPersonById).callCount(1);
                    expect(personDaoMock.getPersonById).calledWith(2)
                });
                it('should create new directory', function ()
                {
                    expect(mkdirMock).callCount(1);
                });

                it('should call fs.createWriteStream', function ()
                {
                    expect(writeStreamMock).callCount(1);
                });

                it('should call oauthToken', function ()
                {
                    expect(oauthTokenMock).callCount(1);
                });
                it('should call createFolderCompany', function ()
                {
                    expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                    expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
                });
                it('should call createYearMonthFolder', function ()
                {
                    expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                    expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoice, yearId);
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
                it('should call updateInvoice', function ()
                {
                    expect(invoiceDAOMock.updateInvoice).callCount(1);
                    expect(invoiceDAOMock.updateInvoice).calledWith(invoice, 4);
                });

            });

            describe('when contractorType is company', function ()
            {
                before(function ()
                {
                    reset();
                    yearId = {company: {shortcut: 'FIRMA_RKR'}, foldrId: 'sdf897sfdsk'};

                    invoice = _.cloneDeep(invoiceMock);
                    invoice.type = 'buy';
                    invoice.companyDealer = 2;
                    invoice.companyRecipent = 1;
                    invoice.personDealer = null;
                    invoice.personRecipent = null;
                    invoice.contractorType = 'company';
                    company = {
                        name: 'Firma',
                        nip: 1234567890,
                        id: 2,
                        shortcut: 'FIRMA_RKR'
                    };


                    oauthTokenMock.resolves('token');
                    invoiceDAOMock.getInvoiceFullNumber.resolves();
                    googleMethodsMock.shareFile.resolves();
                    googleMethodsMock.saveFile.resolves(response);
                    createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyRecipent).resolves(yearId);
                    createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                    invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                    companyDaoMock.getCompanyById.resolves(company);
                    pipeMock.returns({on: sinon.stub().yields()});

                    invoiceManager.addInvoice(data, invoice, 1)
                });

                it('should call getInvoiceFullNumber', function ()
                {
                    expect(invoiceDAOMock.getInvoiceFullNumber).callCount(1);
                    expect(invoiceDAOMock.getInvoiceFullNumber).calledWith(invoice,1);
                });
                it('should call addInvoice', function ()
                {

                    expect(invoiceDAOMock.addInvoice).callCount(1);
                    expect(invoiceDAOMock.addInvoice).calledWith(invoice);

                });
                it('should call getCompanyById', function ()
                {
                    expect(companyDaoMock.getCompanyById).callCount(1);
                    expect(companyDaoMock.getCompanyById).calledWith(2)
                });
                it('should create new directory', function ()
                {
                    expect(mkdirMock).callCount(1);
                });

                it('should call fs.createWriteStream', function ()
                {
                    expect(writeStreamMock).callCount(1);
                });

                it('should call oauthToken', function ()
                {
                    expect(oauthTokenMock).callCount(1);
                });
                it('should call createFolderCompany', function ()
                {
                    expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                    expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
                });
                it('should call createYearMonthFolder', function ()
                {
                    expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                    expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoice, yearId);
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

            });
        });

        describe('when mkdirSync throw error', function ()
        {
            before(() =>
            {
                reset();
                invoice = _.cloneDeep(invoiceMock);
                company = {
                    name: 'Firma',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'FIRMA_RKR'
                };
                oauthTokenMock.resolves('token');
                invoiceDAOMock.getInvoiceFullNumber.resolves();
                invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                invoiceDAOMock.deleteInvoice.resolves();

                companyDaoMock.getCompanyById.resolves(company);

                fs.mkdirSync = sinon.spy(() =>
                {
                    throw applicationException.new(applicationException.ERROR, 'NOT SPACE');
                });

            });
            it('should catch error', function ()
            {
                return invoiceManager.addInvoice(null, invoice, 1).catch(error =>
                {
                    expect(error).eql({error: {message: 'ERROR', code: 500}, message: 'NOT SPACE'});
                })
            });
        });

        describe('when pdfPrinter throw error', function ()
        {
            before(() =>
            {
                reset();
                yearId = {company: {shortcut: 'SMITHJOHN'}, foldrId: 'sdf897sfdsk'};

                invoice = _.cloneDeep(invoiceMock);
                person = {
                    firstName: 'John',
                    lastName: 'Smith',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'SMITHJOHN'
                };
                fs.mkdirSync = sinon.spy();
                invoiceDAOMock.getInvoiceFullNumber.resolves();
                invoiceDAOMock.addInvoice.resolves([{id: 4}]);
                companyDaoMock.getCompanyById.resolves(company);
                invoiceDAOMock.deleteInvoice.resolves();

                pdfGeneratorMock.resolves('something');
                createPdfKitDocumentMock = sinon.spy(() =>
                {
                    throw new Error();
                });
            });
            it('should catch error', function ()
            {
                return invoiceManager.addInvoice(null, invoice, 1).catch(error =>
                {
                    expect(error).eql({
                        error: {message: 'ERROR', code: 500},
                        message: 'Something bad in pdf content: Error'
                    });
                })
            });
        });

        describe('when something wrong', function ()
        {
            before(() =>
            {
                invoice = _.cloneDeep(invoiceMock);
                invoiceDAOMock.getInvoiceFullNumber.reset();
                invoiceDAOMock.getInvoiceFullNumber.rejects();

            });
            it('should throw error', function ()
            {
                invoiceManager.addInvoice('filename', invoice).catch(error =>
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
                invoice = _.cloneDeep(invoiceMock);
                personDaoMock.getPersonById.reset();
                companyDaoMock.getCompanyById.reset();
                companyDealer = {name: 'Firma Test 1', addressId: 1};
                companyRecipent = {name: 'Firma Test 2', addressId: 2};
                addressDealer = {id: 1, street: 'dealer'};
                addressRecipent = {id: 2, street: 'recipient'};

                invoiceDAOMock.getInvoiceById.withArgs(1).resolves(invoice);
                companyDaoMock.getCompanyById.withArgs(invoice.companyDealer).resolves(companyDealer);
                companyDaoMock.getCompanyById.withArgs(invoice.companyRecipent).resolves(companyRecipent);
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
                        expect(invoice).to.eql(result);
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
                        expect(invoice.companyDealer).to.eql(result);
                    })
                });
                it('should set invoice companyRecipent', function ()
                {
                    companyDaoMock.getCompanyById(2).then(result =>
                    {
                        expect(invoice.companyRecipent).to.eql(result);
                    })
                });
                it('should set invoice companyDealer address', function ()
                {
                    addressDaoMock.getAddressById(invoice.companyDealer.addressId).then(result =>
                    {
                        expect(invoice.companyDealer.address).to.eql(result);
                    })
                });
                it('should set invoice companyRecipient address', function ()
                {
                    addressDaoMock.getAddressById(invoice.companyRecipent.addressId).then(result =>
                    {
                        expect(invoice.companyRecipent.address).to.eql(result);
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
                invoice = _.cloneDeep(invoiceMock);
                invoice.contractorType = 'person';
                invoice.companyDealer = null;
                invoice.companyRecipent = null;
                invoice.personDealer = 1;
                invoice.personRecipent = 2;

                personDealer = {name: 'Firma Test 1', addressId: 1};
                personRecipent = {name: 'Firma Test 2', addressId: 2};
                addressDealer = {id: 1, street: 'dealer'};
                addressRecipent = {id: 2, street: 'recipient'};

                invoiceDAOMock.getInvoiceById.withArgs(2).resolves(invoice);
                personDaoMock.getPersonById.withArgs(invoice.personDealer).resolves(personDealer);
                personDaoMock.getPersonById.withArgs(invoice.personRecipent).resolves(personRecipent);
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
                        expect(invoice).to.eql(result);
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
                        expect(invoice.personDealer).to.eql(result);
                    })
                });
                it('should set invoice companyRecipent', function ()
                {
                    personDaoMock.getPersonById(2).then(result =>
                    {
                        expect(invoice.personRecipent).to.eql(result);
                    })
                });
                it('should set invoice personDealer address', function ()
                {
                    addressDaoMock.getAddressById(invoice.personDealer.addressId).then(result =>
                    {
                        expect(invoice.personDealer.address).to.eql(result);
                    })
                });
                it('should set invoice personRecipent address', function ()
                {
                    addressDaoMock.getAddressById(invoice.personRecipent.addressId).then(result =>
                    {
                        expect(invoice.personRecipent.address).to.eql(result);
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
        describe('when contractorType is company', function ()
        {
            before(() =>
            {

                invoice = {
                    id: 1,
                    invoiceNr: 'FV 12/05/111',
                    type: 'buy',
                    createDate: new Date('2012-05-07T22:00:00.000Z'),
                    executionEndDate: new Date('2012-01-17T23:00:00.000Z'),
                    companyDealer: 1,
                    companyRecipent: 2,
                    personDealer: null,
                    personRecipent: null,
                    contractorType: 'company'
                };
                company = {
                    name: 'Firma',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'FIRMA_RKR'
                };
                invoiceDAOMock.getInvoiceById.reset();
                invoiceDAOMock.updateInvoice.reset();
                invoiceDAOMock.updateInvoice.resolves();
                companyDaoMock.getCompanyById.reset();
                oauthTokenMock.reset();
                companyDaoMock.getCompanyById.resolves(company);
                oauthTokenMock.resolves('token');
                googleMethodsMock.renameFile.resolves();
                invoiceDAOMock.getInvoiceById.resolves(invoice);
                invoiceDAOMock.getInvoiceFullNumber.resolves();

                invoiceManager.updateBuyInvoice(invoice, 1);
            });
            it('should call invoiceDao.updateInvoice', function ()
            {
                expect(invoiceDAOMock.updateInvoice).callCount(1);
                expect(invoiceDAOMock.updateInvoice).calledWith(invoice, 1);
            });
            it('should call companyDao.getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(1);
                expect(companyDaoMock.getCompanyById).calledWith(2);
            });
            it('should call googleMethod.renameFile', function ()
            {
                let filename = 'EXP-FIRMA_RKR-2012-05-07-1.pdf';
                expect(googleMethodsMock.renameFile).callCount(1);
                expect(googleMethodsMock.renameFile).calledWith('token', invoice, filename);
            });
        });
        describe('when contractorType is person', function ()
        {
            before(() =>
            {


                invoice = _.cloneDeep(invoiceMock);
                invoice.contractorType = 'person';
                let invoiceDB = _.cloneDeep(invoice);
                invoiceDB.year = 2017;
                invoiceDB.month = 10;
                invoiceDB.number = 12;
                company = {
                    firstName: 'Jan',
                    lastName: 'Kowalski',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'KOWAL1_TRN'
                };
                invoiceDAOMock.getInvoiceById.reset();
                invoiceDAOMock.updateInvoice.reset();
                googleMethodsMock.renameFile.reset();
                invoiceDAOMock.updateInvoice.resolves();
                personDaoMock.getPersonById.reset();
                oauthTokenMock.reset();
                personDaoMock.getPersonById.resolves(company);
                invoiceDAOMock.getInvoiceById.resolves(invoiceDB);
                oauthTokenMock.resolves('token');
                googleMethodsMock.renameFile.resolves();
                invoiceDAOMock.getInvoiceFullNumber.resolves();

                invoiceManager.updateBuyInvoice(invoice, 1);
            });
            it('should call invoiceDao.updateInvoice', function ()
            {
                expect(invoiceDAOMock.updateInvoice).callCount(1);
                expect(invoiceDAOMock.updateInvoice).calledWith(invoice, 1);
            });
            it('should call companyDao.getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(1);
                expect(companyDaoMock.getCompanyById).calledWith(2);
            });
            it('should call googleMethod.renameFile', function ()
            {
                let filename = 'EXP-KOWAL1_TRN-2012-05-07-1.pdf';
                expect(googleMethodsMock.renameFile).callCount(1);
                expect(googleMethodsMock.renameFile).calledWith('token', invoice, filename);
            });
        });

        describe('when error occured', function ()
        {
            before(() =>
            {
                invoiceDAOMock.updateInvoice.rejects(new Error('Cannot update'));

            });
            it('should catch error', function ()
            {
                return invoiceManager.updateBuyInvoice(invoiceMock, 1).catch(error =>
                {
                    expect(error.error).eql({message: 'ERROR', code: 500});
                })
            });
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
        describe('when contractorType is person', function ()
        {
            let yearId = 'sdf897sfdsk';
            let monthId = 'hku4h5uik4';
            let response = {
                id: 'sdfhshs45j3h',
                webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
            };
            before(() =>
            {
                reset();
                yearId = {company: {shortcut: 'SMITHJOHN'}, foldrId: 'sdf897sfdsk'};

                invoice = _.cloneDeep(invoiceMock);
                invoice.type = 'buy';
                invoice.companyDealer = null;
                invoice.companyRecipent = 1;
                invoice.personDealer = 2;
                invoice.personRecipent = null;
                invoice.contractorType = 'person';
                person = {
                    firstName: 'John',
                    lastName: 'Smith',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'SMITHJOHN'
                };

                createPdfKitDocumentMock = sinon.spy(() =>
                {
                    return {
                        end: endMock,
                        pipe: pipeMock
                    }
                });

                mkdirMock = sinon.spy();

                fs = {
                    mkdirSync: mkdirMock,
                    createWriteStream: writeStreamMock
                };

                pdfGeneratorMock.resolves('something');
                oauthTokenMock.resolves('token');
                googleMethodsMock.shareFile.resolves();
                googleMethodsMock.saveFile.resolves(response);
                createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyDealer).resolves(yearId);
                createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                personDaoMock.getPersonById.resolves(person);
                pipeMock.returns({on: sinon.stub().yields()});
                invoiceDAOMock.updateInvoice.resolves();
                googleMethodsMock.deleteFile.resolves();
                invoiceDAOMock.getInvoiceById.resolves(invoice);
                invoiceDAOMock.getInvoiceFullNumber.resolves();

                invoiceManager.updateSellInvoice(invoice, 1, 1);

            });
            it('should call updateInvoice', function ()
            {
                expect(invoiceDAOMock.updateInvoice).callCount(2);
            });
            it('should call oauthToken', function ()
            {
                expect(oauthTokenMock).callCount(1);
            });

            it('should call createPefKitDocument', function ()
            {
                expect(createPdfKitDocumentMock).callCount(1);
            });
            it('should call fs.createWriteStream', function ()
            {
                expect(writeStreamMock).callCount(1);
            });

            it('should call pipe', function ()
            {
                expect(pipeMock).callCount(1);
            });
            it('should call end', function ()
            {
                expect(endMock).callCount(1);
            });

            it('should call createFolderCompany', function ()
            {
                expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
            });
            it('should call createYearMonthFolder', function ()
            {
                expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoice);
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

        });

        describe('when contractorType is company', function ()
        {
            let yearId = 'sdf897sfdsk';
            let monthId = 'hku4h5uik4';
            let response = {
                id: 'sdfhshs45j3h',
                webViewLink: 'https://google/sdfksdjfskfhs4j5jk'
            };
            before(() =>
            {
                reset();
                yearId = {company: {shortcut: 'FIRMA'}, foldrId: 'sdf897sfdsk'};
                invoice = _.cloneDeep(invoiceMock);

                company = {
                    fname: 'FIRMA',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'FIRMA'
                };

                createPdfKitDocumentMock = sinon.spy(() =>
                {
                    return {
                        end: endMock,
                        pipe: pipeMock
                    }
                });

                pdfGeneratorMock.resolves('something');
                oauthTokenMock.resolves('token');
                googleMethodsMock.shareFile.resolves();
                googleMethodsMock.saveFile.resolves(response);
                createFoldersGoogleMock.createFolderCompany.withArgs('token', invoice.companyDealer).resolves(yearId);
                createFoldersGoogleMock.createYearMonthFolder.withArgs('token', invoice, yearId).resolves(monthId);
                companyDaoMock.getCompanyById.resolves(company);
                pipeMock.returns({on: sinon.stub().yields()});
                invoiceDAOMock.updateInvoice.resolves();
                googleMethodsMock.deleteFile.resolves();
                invoiceDAOMock.getInvoiceById.resolves(invoice);

                invoiceManager.updateSellInvoice(invoice, 1, 1);

            });
            it('should call updateInvoice', function ()
            {
                expect(invoiceDAOMock.updateInvoice).callCount(2);
            });
            it('should call oauthToken', function ()
            {
                expect(oauthTokenMock).callCount(1);
            });

            it('should call createPefKitDocument', function ()
            {
                expect(createPdfKitDocumentMock).callCount(1);
            });
            it('should call fs.createWriteStream', function ()
            {
                expect(writeStreamMock).callCount(1);
            });

            it('should call pipe', function ()
            {
                expect(pipeMock).callCount(1);
            });
            it('should call end', function ()
            {
                expect(endMock).callCount(1);
            });

            it('should call createFolderCompany', function ()
            {
                expect(createFoldersGoogleMock.createFolderCompany).callCount(1);
                expect(createFoldersGoogleMock.createFolderCompany).calledWith('token', 1);
            });
            it('should call createYearMonthFolder', function ()
            {
                expect(createFoldersGoogleMock.createYearMonthFolder).callCount(1);
                expect(createFoldersGoogleMock.createYearMonthFolder).calledWith('token', invoice);
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

        });

        describe('when unknown error occurred', function ()
        {
            let update = {};
            before(() =>
            {
                invoice = _.cloneDeep(invoiceMock);
                googleMethodsMock.deleteFile.rejects();
                return invoiceManager.updateSellInvoice(invoice, 1, 'file.pdf')
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
            before(() =>
            {
                invoice = _.cloneDeep(invoiceMock);
                googleMethodsMock.deleteFile.rejects(applicationException.new(404, 'FILE NOT FOUND'));
                return invoiceManager.updateSellInvoice(invoice, 1, 'file.pdf').catch(error =>
                {
                    update = error;
                })
            });
            it('should throw error', function ()
            {
                expect(update).eql({error: 404, message: 'FILE NOT FOUND'});
            });
        });

        describe('when mkdirSync throw error', function ()
        {
            before(() =>
            {
                invoice = _.cloneDeep(invoiceMock);
                googleMethodsMock.deleteFile.reset();
                googleMethodsMock.deleteFile.resolves();
                fs.mkdirSync = sinon.spy(() =>
                {
                    throw applicationException.new(applicationException.ERROR, 'NOT SPACE');
                });

            });
            it('should catch error', function ()
            {
                return invoiceManager.updateSellInvoice(invoice, 1, 1).catch(error =>
                {
                    expect(error).eql({error: {message: 'ERROR', code: 500}, message: 'NOT SPACE'});
                })
            });
        });

        describe('when pdfPrinter throw error', function ()
        {

            before(() =>
            {
                invoice = _.cloneDeep(invoiceMock);
                person = {
                    firstName: 'John',
                    lastName: 'Smith',
                    nip: 1234567890,
                    id: 2,
                    shortcut: 'SMITHJOHN'
                };

                oauthTokenMock.resolves('token');
                invoiceDAOMock.updateInvoice.reset();
                invoiceDAOMock.updateInvoice.resolves();
                fs.mkdirSync = sinon.spy();
                companyDaoMock.getCompanyById.resolves(company);
                googleMethodsMock.deleteFile.resolves();

                pdfGeneratorMock.resolves('something');

                createPdfKitDocumentMock = sinon.spy(() =>
                {
                    throw applicationException.new(applicationException.ERROR, 'Something bad in pdf content: Error');
                });
            });
            it('should catch error', function ()
            {
                return invoiceManager.updateSellInvoice(invoice, 1, 1).catch(error =>
                {
                    expect(error).eql({
                        error: {message: 'ERROR', code: 500},
                        message: 'Something bad in pdf content: Error'
                    });
                })
            });
        });
    });

    describe('changeStatus', function ()
    {
        before(() =>
        {
            invoiceManager.changeStatus(1, 'paid');
        });
        it('should call changeStatus', function ()
        {
            expect(invoiceDAOMock.changeStatus).callCount(1);
            expect(invoiceDAOMock.changeStatus).calledWith(1, 'paid');
        });
    });

});
