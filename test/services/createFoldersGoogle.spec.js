'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;
let companyFolderId = {
    id: 'uifg7dyfg78'
};
let yearId = {
    id: 'sdfksf'
};

let monthId = {
    id: 'jskhggu7sdy8'
};
let companyDaoMock = {
    getCompanyById: sinon.stub(),
    addFolderId: sinon.spy()
};

let googleMethods = {
    createFolder: sinon.stub(),
    createChildFolder: sinon.stub()
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
];

let company = {
    name: 'Firma do testów',
    nip: 1234567890
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
        before(function ()
        {
            companyDaoMock.getCompanyById.withArgs(1).resolves(company);
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
            expect(googleMethods.createFolder).callCount(1);
            expect(googleMethods.createFolder).calledWith('auth', company.name);
        });
        it('should call addFolderId', function ()
        {
            expect(companyDaoMock.addFolderId).callCount(1);
            expect(companyDaoMock.addFolderId).calledWith(companyFolderId.id, company.nip);
        });
    });

    describe('createYearMonthFolder', function ()
    {
        before(function ()
        {
            googleMethods.createChildFolder.onFirstCall().resolves(yearId);
            googleMethods.createChildFolder.onSecondCall().resolves(monthId);

            createFoldersGoogleMock.createYearMonthFolder('auth', invoice, companyFolderId.id)
        });
        it('should call createChildFolder', function ()
        {
            expect(googleMethods.createChildFolder).callCount(2);
        });
        it('should first call with auth, year and id properties', function ()
        {
            expect(googleMethods.createChildFolder).calledWith('auth', 2017, companyFolderId.id);
        });
        it('should second call with auth, month and id properties ', function ()
        {
            expect(googleMethods.createChildFolder).calledWith('auth', monthNames[new Date(invoice.createDate).getMonth()], yearId.id);
        });
    });
});

