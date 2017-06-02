'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;
let companyFolderId = {company: {shortcut: 'TEST'}, folderId: 'uifg7dyfg78'};
let yearId = {files: [{id: 'sdfksf'}]};
let monthId = {files: [{id: 'jskhggu7sdy8'}]};
let createYearId = 'jsdfhsjkdfhsdkjfh';
let createMonthId = 'sjkdfhsjkfh';

let companyDaoMock = {
    getCompanyById: sinon.stub(),
    addFolderId: sinon.spy()
};

let googleMethods = {
    createFolder: sinon.stub(),
    createChildFolder: sinon.stub(),
    checkFolderExists: sinon.stub(),
    findFolderByName: sinon.stub()
};

let company = {
    name: 'Firma do testów',
    nip: 1234567890,
    shortcut: 'TEST',
    googleCompanyId: 'sdfsfashks'
};

let invoice = {
    createDate: '2017-04-13'
};

let createFoldersGoogleMock = proxyquire('../../app/services/createFoldersGoogle', {
    '../dao/company.dao': companyDaoMock,
    './google.methods': googleMethods
});

describe('createFoldersGoogle', function ()
{
    describe('createFolderCompany', function ()
    {
        describe('when company folder exist', function ()
        {
            before(function ()
            {
                companyDaoMock.getCompanyById.withArgs(1).resolves(company);
                googleMethods.checkFolderExists.resolves(companyFolderId);
                createFoldersGoogleMock.createFolderCompany('auth', 1);
            });
            it('should call getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(1);
                expect(companyDaoMock.getCompanyById).calledWith(1);
            });
            it('should call createFolder', function ()
            {
                expect(googleMethods.checkFolderExists).callCount(1);
                expect(googleMethods.checkFolderExists).calledWith('auth', company.googleCompanyId);
            });
            it('should call addFolderId', function ()
            {
                expect(companyDaoMock.addFolderId).callCount(1);
                expect(companyDaoMock.addFolderId).calledWith(companyFolderId, company.nip);
            });
        });
        describe('when company folder don\'t exist', function ()
        {
            before(function ()
            {
                companyDaoMock.addFolderId.reset();
                companyDaoMock.getCompanyById.reset();
                googleMethods.checkFolderExists.reset();
                companyDaoMock.getCompanyById.withArgs(1).resolves(company);
                googleMethods.checkFolderExists.rejects();
                googleMethods.createFolder.resolves(companyFolderId);
                createFoldersGoogleMock.createFolderCompany('auth', 1);
            });
            it('should call getCompanyById', function ()
            {
                expect(companyDaoMock.getCompanyById).callCount(1);
                expect(companyDaoMock.getCompanyById).calledWith(1);
            });
            it('should call createFolder', function ()
            {
                expect(googleMethods.checkFolderExists).callCount(1);
                expect(googleMethods.checkFolderExists).calledWith('auth', company.googleCompanyId);
            });
            it('should call addFolderId', function ()
            {
                expect(companyDaoMock.addFolderId).callCount(1);
                expect(companyDaoMock.addFolderId).calledWith(companyFolderId, company.nip);
            });
        });
    });

    describe('createYearMonthFolder', function ()
    {
        let name1 = '2017-TEST';
        let name2 = '2017-04-TEST';
        describe('when folder year and month exist', function ()
        {
            before(function ()
            {
                googleMethods.findFolderByName.onFirstCall().resolves(yearId);
                googleMethods.findFolderByName.onSecondCall().resolves(monthId);


                createFoldersGoogleMock.createYearMonthFolder('auth', invoice, companyFolderId)
            });
            it('should call findFolderById two times', function ()
            {
                expect(googleMethods.findFolderByName).callCount(2);
            });
            it('should first call with auth, year and companyFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name1,companyFolderId.folderId);
            });
            it('should second call with auth, month and yearFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name2, yearId.files[0].id);
            });
            it('should set invoice googleYearFolderId', function ()
            {
                expect(invoice.googleYearFolderId).eql(yearId.files[0].id);
            });
            it('should set invoice googleMonthFolderId', function ()
            {
                expect(invoice.googleMonthFolderId).eql(monthId.files[0].id);
            });

        });

        describe('when folder year exist and create new month folder', function ()
        {
            before(function ()
            {
                monthId.files = [];
                googleMethods.findFolderByName.reset();
                googleMethods.findFolderByName.onFirstCall().resolves(yearId);
                googleMethods.createChildFolder.resolves(createMonthId);
                googleMethods.findFolderByName.onSecondCall().resolves(monthId);


                createFoldersGoogleMock.createYearMonthFolder('auth', invoice, companyFolderId)
            });
            it('should call findFolderById two times', function ()
            {
                expect(googleMethods.findFolderByName).callCount(2);
            });
            it('should first call with auth, year and companyFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name1,companyFolderId.folderId);
            });
            it('should second call with auth, month and yearFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name2, yearId.files[0].id);
            });
            it('should call createChildFolder', function ()
            {
                expect(googleMethods.createChildFolder).callCount(1);
                expect(googleMethods.createChildFolder).calledWith('auth',name2,yearId.files[0].id)
            });
            it('should set invoice googleYearFolderId', function ()
            {
                expect(invoice.googleYearFolderId).eql(yearId.files[0].id);
            });
            it('should set invoice googleMonthFolderId', function ()
            {
                expect(invoice.googleMonthFolderId).eql(createMonthId);
            });

        });

        describe('when folder year don\'t exist and month folder exists', function ()
        {
            before(function ()
            {
                yearId.files = [];
                monthId = {files: [{id: 'jskhggu7sdy8'}]};
                googleMethods.findFolderByName.reset();
                googleMethods.createChildFolder.reset();
                googleMethods.findFolderByName.onFirstCall().resolves(yearId);
                googleMethods.createChildFolder.resolves(createYearId);
                googleMethods.findFolderByName.onSecondCall().resolves(monthId);


                createFoldersGoogleMock.createYearMonthFolder('auth', invoice, companyFolderId)
            });
            it('should call findFolderById two times', function ()
            {
                expect(googleMethods.findFolderByName).callCount(2);
            });
            it('should first call with auth, year and companyFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name1,companyFolderId.folderId);
            });
            it('should second call with auth, month and yearFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name2, createYearId);
            });
            it('should call createChildFolder', function ()
            {
                expect(googleMethods.createChildFolder).callCount(1);
                expect(googleMethods.createChildFolder).calledWith('auth',name1,companyFolderId.folderId)
            });
            it('should set invoice googleYearFolderId', function ()
            {
                expect(invoice.googleYearFolderId).eql(createYearId);
            });
            it('should set invoice googleMonthFolderId', function ()
            {
                expect(invoice.googleMonthFolderId).eql(monthId.files[0].id);
            });

        });

        describe('when folder year don\'t exist and month folder don\'t exist', function ()
        {
            before(function ()
            {
                yearId.files = [];
                monthId.files = [];
                googleMethods.findFolderByName.reset();
                googleMethods.createChildFolder.reset();
                googleMethods.findFolderByName.onFirstCall().resolves(yearId);
                googleMethods.createChildFolder.onFirstCall().resolves(createYearId);
                googleMethods.findFolderByName.onSecondCall().resolves(monthId);
                googleMethods.createChildFolder.onSecondCall().resolves(createMonthId);

                createFoldersGoogleMock.createYearMonthFolder('auth', invoice, companyFolderId)
            });
            it('should call findFolderById two times', function ()
            {
                expect(googleMethods.findFolderByName).callCount(2);
            });
            it('should first call with auth, year and companyFolderId', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name1,companyFolderId.folderId);
            });
            it('should second call with auth, month and yearFolderId arguments', function ()
            {
                expect(googleMethods.findFolderByName).calledWith('auth',name2, createYearId);
            });
            it('should call createChildFolder', function ()
            {
                expect(googleMethods.createChildFolder).callCount(2);
            });
            it('should first call createChildFolder with auth, year and companyFolderId arguments', function ()
            {
                expect(googleMethods.createChildFolder).calledWith('auth',name1,companyFolderId.folderId)
            });
            it('should set invoice googleYearFolderId', function ()
            {
                expect(invoice.googleYearFolderId).eql(createYearId);
            });
            it('should set invoice googleMonthFolderId', function ()
            {
                expect(invoice.googleMonthFolderId).eql(createMonthId);
            });

        });
    });
});

