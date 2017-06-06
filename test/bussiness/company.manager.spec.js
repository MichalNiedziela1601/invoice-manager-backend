'use strict';

const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

const companies = [{
    addressId: 1, id: 1, name: 'Kuba', nip: 1029384756, regon: 243124,
}, {
    addressId: 2, id: 2, name: 'Firma badfghjklrtek', nip: 176543330, regon: 55343367,
}, {
    addressId: 3, id: 3, name: 'Firma test', nip: 8967452310, regon: null
}];
const address = [{
    id: 1, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: '33-199', city: 'Tarnow'
}, {
    id: 2, street: 'Krakowska', buildNr: 8, flatNr: 7, postCode: '33-159', city: 'Kakow'
}, {
    id: 3, street: 'Krakowska', buildNr: 8, flatNr: 7, postCode: '33-159', city: 'Kakow'

}];

let companyMock = {id: 1, name: 'Firma Test', addressId: 1};

let companyDAOMock = {
    getCompanies: sinon.stub(),
    addCompany: sinon.stub().resolves(),
    getNips: sinon.stub().resolves(),
    getCompanyById: sinon.stub().resolves(companyMock),
    updateCompanyAddress: sinon.stub().resolves(),
    getCompanyDetails: sinon.stub().rejects(),
    addFolderId: sinon.spy(),
    getCompanyByNip: sinon.stub(),
    findShortcut: sinon.stub(),
    updateCompany: sinon.stub()
};
let addressDAOMock = {
    getAddressById: sinon.stub().resolves(),
    updateAddress: sinon.stub().resolves(),
    addAddress: sinon.stub()
};

let companyManager = proxyquire('../../app/business/company.manager', {
    '../dao/company.dao.js': companyDAOMock, '../dao/address.dao': addressDAOMock
});

companyManager.catch = sinon.stub();

describe('company.manager', function ()
{
    describe('getCompanies', function ()
    {
        describe('when companies exists', function ()
        {

            before(function ()
            {
                companyDAOMock.getCompanies.resolves(companies);
                addressDAOMock.getAddressById.withArgs(1).resolves(address[0]);
                addressDAOMock.getAddressById.withArgs(2).resolves(address[1]);
                addressDAOMock.getAddressById.withArgs(3).resolves(address[2]);
                return companyManager.getCompanies();
            });
            it('should call getCompanies on companyDao', function ()
            {
                expect(companyDAOMock.getCompanies).callCount(1);
            });
            it('should call getAddressById on addressDAO ', function ()
            {
                expect(addressDAOMock.getAddressById).callCount(3);
            });
            it('should call getAddressById with company.addressId', function ()
            {
                expect(addressDAOMock.getAddressById).calledWith(1);
                expect(addressDAOMock.getAddressById).calledWith(2);
                expect(addressDAOMock.getAddressById).calledWith(3);
            });

        });
        describe('when table is empty', function ()
        {
            before(() =>
            {
                companyDAOMock.getCompanies.rejects();
            });
            it('should throw error', function ()
            {
                companyManager.getCompanies().catch(error =>
                {
                    expect(error.error).eql({message: 'NOT_FOUND', code: 404});
                });
            });
        });
    });

    describe('getCompanyDetails', function ()
    {
        let companyMock = {};
        let addressMock = {};
        before(() =>
        {
            companyDAOMock.getCompanyByNip.reset();
            addressDAOMock.getAddressById.reset();
            companyMock = {name: 'Firma', addressId: 1, nip: 1234567777};
            addressMock = {id: 1, street: 'Test'};
            companyDAOMock.getCompanyByNip.resolves(companyMock);
            addressDAOMock.getAddressById.resolves(addressMock);
            companyManager.getCompanyDetails(1234567777);
        });
        it('should call getCompanyByNip', function ()
        {
            expect(companyDAOMock.getCompanyByNip).callCount(1);
            expect(companyDAOMock.getCompanyByNip).calledWith(1234567777);
        });
        it('should call getAddressById', function ()
        {
            expect(addressDAOMock.getAddressById).callCount(1);
            expect(addressDAOMock.getAddressById).calledWith(1);
        });
    });

    describe('addCompany', function ()
    {
        before(function ()
        {
            companyDAOMock.getCompanyByNip.reset();
            addressDAOMock.getAddressById.reset();
            companyDAOMock.getCompanyByNip.rejects();
            addressDAOMock.addAddress.reset();
            addressDAOMock.addAddress.withArgs({street: 'goodStreet'}).resolves(100);
        });
        describe('always', function ()
        {
            before(function ()
            {
                return companyManager.addCompany({address: {street: 'goodStreet'}});
            });
            it('should call addAddress on companyDao', function ()
            {
                expect(addressDAOMock.addAddress).to.have.callCount(1);
            });
            it('should call addAddress on companyDao with company address', function ()
            {
                expect(addressDAOMock.addAddress).to.have.been.calledWith({street: 'goodStreet'});
            });
        });
        describe('when company address successful add to database', function ()
        {
            before(function ()
            {
                return companyManager.addCompany({address: {street: 'goodStreet'}});
            });
            it('should call addCompany on companyDao with company data', function ()
            {
                expect(companyDAOMock.addCompany).to.have.been.calledWith({address: {street: 'goodStreet'}, addressId: 100});
            });
        });
        describe('when company address wasn\'t added to the database', function ()
        {
            before(function ()
            {
                companyDAOMock.addCompany.reset();
                addressDAOMock.addAddress.withArgs({street: 'badStreet'}).rejects();
            });

            it('should call addCompany on companyDao with company data', function ()
            {
                return companyManager.addCompany({address: {street: 'badStreet'}}).then(function ()
                {
                    throw new Error('not supposed to be succeed');
                }).catch(function ()
                {
                    expect(companyDAOMock.addCompany).to.have.callCount(0);
                });
            });
        });
        describe('when company with nip exist in database', function ()
        {
            let result = {};
            before(() =>
            {
                companyDAOMock.getCompanyByNip.reset();
                companyMock = {
                    name: 'bla', nip: 1234567890, addressId: null, id: 1
                };
                companyDAOMock.getCompanyByNip.resolves({name: 'sdfsdf', nip: 1234567890});
                result = companyManager.addCompany(companyMock);

            });
            it('should throw error', function ()
            {
                result.catch(error =>
                {
                    expect(error).eql({
                        error: {message: 'CONFLICT', code: 409},
                        message: 'Company with this nip exist in database'
                    })
                })
            });
        });
    });

    describe('getNips', function ()
    {
        describe('when some part of nip are is match', function ()
        {
            before(function ()
            {
                return companyManager.getNips(34);
            });

            it('should call getNips from companyDAO ', function ()
            {
                expect(companyDAOMock.getNips).to.have.callCount(1);
            });
            it('should call getNips with some part of nip', function ()
            {
                expect(companyDAOMock.getNips).to.have.calledWith(34);
            });
        });
    });

    describe('updateCompanyAddress', function ()
    {
        let addressChange = {
            street: 'Towarowa',
            buildNr: '43',
            flatNr: '3',
            postCode: '33-100',
            city: 'City 1'
        };

        describe('when address exists', function ()
        {
            before(function ()
            {
                companyMock = {id: 1, name: 'Firma Test', addressId: 1};
                companyDAOMock.getCompanyById.withArgs(companyMock.id).resolves(companyMock);
                addressDAOMock.updateAddress.withArgs(addressChange, companyMock.addressId).resolves();
                companyManager.updateCompanyAddress(addressChange, companyMock.id);
            });

            it('should call getCompanyById', function ()
            {
                expect(companyDAOMock.getCompanyById).callCount(1);
            });
            it('should call getCompanyById with companyId', function ()
            {
                expect(companyDAOMock.getCompanyById).calledWith(1);
            });
            it('should call updateAddress', function ()
            {
                companyDAOMock.getCompanyById(1).then(() =>
                {
                    expect(addressDAOMock.updateAddress).callCount(1);
                })
            });
            it('should call updateAddress with address and addressId', function ()
            {
                companyDAOMock.getCompanyById(1).then(company =>
                {
                    expect(addressDAOMock.updateAddress).calledWith(addressChange, company.addressId)
                })
            });
        });

        describe('when address not exists', function ()
        {
            before(function ()
            {
                companyDAOMock.getCompanyById.reset();
                addressDAOMock.addAddress.reset();

                companyMock = {name: 'Firma Test 2', id: 2};
                companyDAOMock.getCompanyById.withArgs(companyMock.id).resolves(companyMock);
                addressDAOMock.addAddress.withArgs(addressChange).resolves(2);
                companyManager.updateCompanyAddress(addressChange, companyMock.id);
            });

            it('should call getCompanyById', function ()
            {
                expect(companyDAOMock.getCompanyById).callCount(1);
            });
            it('should call getCompanyById with companyId', function ()
            {
                expect(companyDAOMock.getCompanyById).calledWith(2);
            });
            it('should call addAddress', function ()
            {
                companyDAOMock.getCompanyById(2).then(() =>
                {
                    expect(companyManager.addAddress).callCount(1);
                })
            });
            it('should call addAddress with address ', function ()
            {
                companyDAOMock.getCompanyById(2).then(() =>
                {
                    expect(companyManager.addAddress).calledWith(addressChange)
                })
            });
            it('should call companyDao.updateCompanyAddress', function ()
            {
                expect(companyDAOMock.updateCompanyAddress).callCount(1);
            });
            it('should call companyDao.updateCompanyAddress with addressId and companyId', function ()
            {
                expect(companyDAOMock.updateCompanyAddress).calledWith(2, companyMock.id);
            });
        });
    });

    describe('addFolderId', function ()
    {
        before(() =>
        {
            return companyManager.addFolderId(2, 12345);
        });
        it('should call companyDao.addFolderId', function ()
        {
            expect(companyDAOMock.addFolderId).callCount(1);
        });
        it('should called with id and nip', function ()
        {
            expect(companyDAOMock.addFolderId).calledWith(2, 12345);
        });
    });
    describe('getCompanyId', function ()
    {
        let addressMock = {};
        before(() =>
        {
            companyDAOMock.getCompanyById.reset();
            addressDAOMock.getAddressById.reset();
            companyMock = {name: 'sdfhsdjf', nip: 1234567890, addressId: 1, id: 1};
            addressMock = {id: 1, street: 'Lwowska', buildNr: '34', postCode: '33-100', ciity: 'Tarnów'};
            companyDAOMock.getCompanyById.resolves(companyMock);
            addressDAOMock.getAddressById.withArgs(1).resolves(addressMock);

            return companyManager.getCompanyById(1);
        });
        it('should call companyDao.getCompanyById', function ()
        {
            expect(companyDAOMock.getCompanyById).callCount(1);
            expect(companyDAOMock.getCompanyById).calledWith(1);
        });
        it('should call addressDAO.getAddressById', function ()
        {
            expect(addressDAOMock.getAddressById).callCount(1);
            expect(addressDAOMock.getAddressById).calledWith(1);
        });
    });

    describe('findShortcut', function ()
    {
        before(() =>
        {
            companyDAOMock.findShortcut.reset();
            companyDAOMock.findShortcut.resolves();
            companyManager.findShortcut({shortcut: 'FIRMATEST'});
        });
        it('should call findShortcut', function ()
        {
            expect(companyDAOMock.findShortcut).callCount(1);
            expect(companyDAOMock.findShortcut).calledWith({shortcut: 'FIRMATEST'});
        });
    });

    describe('updateCompany', function ()
    {
        before(() =>
        {
            addressDAOMock.updateAddress.reset();
            companyDAOMock.updateCompany.resolves();
            addressDAOMock.updateAddress.resolves();

            companyManager.updateCompany({address: {street: 'fake'}, addressId: 1});
        });
        it('should call companyDAO.updateCompany', function ()
        {
            expect(companyDAOMock.updateCompany).callCount(1);
            expect(companyDAOMock.updateCompany).calledWith({address: {street: 'fake'}, addressId: 1});
        });
        it('should call addressDAO.updateAddress', function ()
        {
            expect(addressDAOMock.updateAddress).callCount(1);
            expect(addressDAOMock.updateAddress).calledWith({street: 'fake'},1);
        });
    });
});
