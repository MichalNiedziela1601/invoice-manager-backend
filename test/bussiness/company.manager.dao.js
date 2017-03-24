'use strict';

const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

let companyDAOMock = {
    getCompanies: sinon.spy(),
    addAddress: sinon.stub().resolves(),
    addCompany: sinon.stub().resolves()
};

let companyManager = proxyquire('../../app/business/company.manager', {
    '../dao/company.dao.js': companyDAOMock
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
