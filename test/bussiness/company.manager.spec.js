'use strict';

const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

const companies = [{
    addressId: 2, id: 1, name: 'Kuba', nip: 1029384756, regon: 243124,
}, {
    addressId: 1, id: 2, name: 'Firma badfghjklrtek', nip: 176543330, regon: 55343367,
}];
const address = [{
    id: 1, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: '33-199', city: 'Tarnow'
}, {
    id: 3, street: 'Krakowska', buildNr: 8, flatNr: 7, postCode: '33-159', city: 'Kakow'

}];

let companyMock = {id: 1, name: 'Firma Test', addressId: 1};

let companyDAOMock = {
    getCompanies: sinon.stub().resolves(companies),
    addAddress: sinon.stub().resolves(),
    addCompany: sinon.stub().resolves(),
    getNips: sinon.stub().resolves(),
    getCompanyById: sinon.stub().resolves(companyMock),
    updateCompanyAddress: sinon.stub().resolves()
};
let addressDAOMock = {
    getAddressById: sinon.stub().resolves(address),
    updateAddress: sinon.stub().resolves(),
    updateCompanyAddress: sinon.stub().resolves
};

let companyManager = proxyquire('../../app/business/company.manager', {
    '../dao/company.dao.js': companyDAOMock, '../dao/address.dao.js': addressDAOMock
});

companyManager.catch = sinon.stub();

describe('company.manager', function ()
{
    describe('getCompanies', function ()
    {
        before(function ()
        {
            return companyManager.getCompanies();
        });
        it('should call getCompanies on companyDao', function ()
        {
            expect(companyDAOMock.getCompanies).to.have.callCount(1);
        });
        describe('getAddressById on addressDAO', function ()
        {
            before(function ()
            {
                return addressDAOMock.getAddressById({addressId: 1});
            });
            it('should call getAddressById on addressDAO ', function ()
            {
                expect(addressDAOMock.getAddressById).to.have.callCount(1);
            });
            it('should call getAddressById with company.addressId', function ()
            {
                expect(addressDAOMock.getAddressById).to.have.been.calledWith({addressId: 1});

            });
        });
    });

    describe('addAddress', function ()
    {
        before(function ()
        {
            return companyManager.addAddress('address');
        });
        it('should call addAddress on companyDao', function ()
        {
            expect(companyDAOMock.addAddress).to.have.callCount(1);
        });
        it('should call addAddress with company address', function ()
        {
            expect(companyDAOMock.addAddress).to.have.been.calledWith('address');
        });
    });
    describe('addCompany', function ()
    {
        before(function ()
        {
            companyDAOMock.addAddress.reset();
            companyDAOMock.addAddress.withArgs({street: 'goodStreet'}).resolves(100);
        });
        describe('always', function ()
        {
            before(function ()
            {
                return companyManager.addCompany({address: {street: 'goodStreet'}});
            });
            it('should call addAddress on companyDao', function ()
            {
                expect(companyDAOMock.addAddress).to.have.callCount(1);
            });
            it('should call addAddress on companyDao with company address', function ()
            {
                expect(companyDAOMock.addAddress).to.have.been.calledWith({street: 'goodStreet'});
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
                companyDAOMock.addAddress.withArgs({street: 'badStreet'}).rejects();
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
                companyDAOMock.addAddress.reset();

                companyMock = {name: 'Firma Test 2', id: 2};
                companyDAOMock.getCompanyById.withArgs(companyMock.id).resolves(companyMock);
                companyDAOMock.addAddress.withArgs(addressChange).resolves(2);
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
                expect(companyDAOMock.updateCompanyAddress).calledWith(2,companyMock.id);
            });
        });
    });
});
