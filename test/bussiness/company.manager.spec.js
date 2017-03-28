'use strict';

const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

const companies = [{
    addressId: 2,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
}, {
    addressId: 1,
    id: 2,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    regon: 55343367,
}];
const address = [{
    id: 1,
    street: 'Spokojna',
    buildNr: 4,
    flatNr: 3,
    postCode: '33-199',
    city: 'Tarnow'
}, {
    id: 3,
    street: 'Krakowska',
    buildNr: 8,
    flatNr: 7,
    postCode: '33-159',
    city: 'Kakow'

}];

let companyDAOMock = {
    getCompanies: sinon.stub().resolves(companies),
    addAddress: sinon.stub().resolves(),
    addCompany: sinon.stub().resolves()
};
let addressDAOMock = {
    getAddressById: sinon.stub().resolves(address)
};

let companyManager = proxyquire('../../app/business/company.manager', {
    '../dao/company.dao.js': companyDAOMock,
    '../dao/address.dao.js': addressDAOMock
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
            companyDAOMock.addAddress.resetHistory();
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
                companyDAOMock.addCompany.resetHistory();
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
});
