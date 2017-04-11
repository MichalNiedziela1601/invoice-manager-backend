'use strict';

const expect = require('chai').expect;
const companyDAO = require('../../app/dao/company.dao');
const data = require('../fixtures/company.dao.fixtures');
const testHelper = require('../testHelper');
const _ = require('lodash');
const parser = require('../../app/services/camelCaseParser');

describe('company.dao', function ()
{
    let companies = [];
    let addresses = [];

    function addInvalidAddressHelper(invalidAddress)
    {
        return companyDAO.addAddress(invalidAddress).then(function ()
        {
            throw new Error('function then should not be served')
        }).catch(function ()
        {
            return testHelper.clearDB().then(function ()
            {
                return testHelper.seed('test/seed/select.addresses.sql').then(function (result)
                {
                    addresses = parser.parseArrayOfObject(result);
                })
            })
        });
    }

    beforeEach(function ()
    {
        companies = [];
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/company.dao.sql')
        });
    });
    describe('addCompany', function ()
    {
        let company = {
            name: 'Firma badfghjklrtek', nip: 176543330, regon: 55343367, addressId: 2
        };
        let companyValidId = {id: 3};
        _.assign(companyValidId, company);

        describe('properties is valid', function ()
        {
            beforeEach(function ()
            {
                return companyDAO.addCompany(companyValidId).then(function ()
                {
                    return companyDAO.getCompanies().then(function (result)
                    {
                        companies = result;
                    })
                });
            });
            it('should add company to database', function ()
            {
                expect(companies).to.eql(data.companies);
            });
        });
        describe('properties is invalid', function ()
        {
            describe('company name is invalid', function ()
            {
                beforeEach(function ()
                {
                    let invalidCompany = _.omit(company, ['name']);

                    return companyDAO.addCompany(invalidCompany).then(function ()
                    {
                        throw new Error('function then should not be served');
                    }).catch(function ()
                    {
                        return companyDAO.getCompanies().then(function (result)
                        {
                            companies = result;
                        })
                    });
                });
                it('should not add contractor', function ()
                {
                    expect(companies).to.eql([data.companies[0],data.companies[1]])
                });
            });
            describe('company nip is invalid', function ()
            {
                beforeEach(function ()
                {
                    let invalidCompany = _.omit(company, ['nip']);

                    return companyDAO.addCompany(invalidCompany).then(function ()
                    {
                        throw new Error('function then should not be served');
                    }).catch(function ()
                    {
                        return companyDAO.getCompanies().then(function (result)
                        {
                            companies = result;
                        })
                    });
                });
                it('should not add contractor', function ()
                {
                    expect(companies).to.eql([data.companies[0],data.companies[1]])
                });
            });
        });
    });
    describe('getCompanyByNip', function ()
    {
        let nip = 1029384756;
        let companies = {};
        beforeEach(function ()
        {
            return companyDAO.getCompanyByNip(nip).then(function (result)
            {
                companies = result;
            });
        });
        it('should add company to database', function ()
        {
            expect(companies).to.eql(data.findCompany);
        });
        describe('getCompanyByNip with invalid nip', function ()
        {
            beforeEach(function ()
            {
                let invalidNip = 3456791345;
                let companies = {};
                return companyDAO.getCompanyByNip(invalidNip).then(function ()
                {
                    throw new Error('function then should not be served');

                }).catch(function ()
                {
                    return companyDAO.getCompanies().then(function (result)
                    {
                        companies = result;
                    })
                });
            });
            it('should add company to database', function ()
            {
                expect(companies).to.eql(data.nothing);
            });
        });
    });

    describe('addAddress', function ()
    {
        let validAddress = {street: 'Duza', buildNr: '1', flatNr: '13', postCode: '33 - 333', city: 'Waszyngton'};
        let validAddressWithId = {id: 3};
        _.assign(validAddressWithId, validAddress);

        describe('properties are valid', function ()
        {
            beforeEach(function ()
            {
                return companyDAO.addAddress(validAddress).then(function ()
                {
                    return testHelper.seed('test/seed/select.addresses.sql').then(function (result)
                    {
                        addresses = parser.parseArrayOfObject(result);
                    })
                })
            });
            it('should add new address', function ()
            {
                expect(addresses[2]).to.eql(validAddressWithId)
            });
        });
        describe('properties are invalid', function ()
        {
            describe('street property is null', function ()
            {
                let invalidAddress = _.omit(validAddress, ['street']);

                beforeEach(function ()
                {
                    return addInvalidAddressHelper(invalidAddress);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(addresses).to.eql([])
                });
            });
            describe('buildNr property is null', function ()
            {
                let invalidAddress = _.omit(validAddress, ['buildNr']);

                beforeEach(function ()
                {
                    return addInvalidAddressHelper(invalidAddress);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(addresses).to.eql([])
                });
            });
            describe('post-code property is null', function ()
            {
                let invalidAddress = _.omit(validAddress, ['postCode']);

                beforeEach(function ()
                {
                    return addInvalidAddressHelper(invalidAddress);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(addresses).to.eql([])
                });
            });
            describe('city property is null', function ()
            {
                let invalidAddress = _.omit(validAddress, ['city']);

                beforeEach(function ()
                {
                    return addInvalidAddressHelper(invalidAddress);
                });

                it('should not add invoice if type is invalid', function ()
                {
                    expect(addresses).to.eql([])
                });
            });
        });
    });

    describe('addCompanyRegister', function ()
    {
        let company = {name: 'Firma test', nip: 7890123456};
        describe('when company data is valid', function ()
        {
            let id = null;
            beforeEach(function ()
            {
                return companyDAO.addCompanyRegister(company).then(result =>
                {
                    id = result;

                }).then(() => {
                    return companyDAO.getCompanies().then(result => {
                        companies = _.sortBy(result,'id');
                    })
                })
            });
            it('should return id', function ()
            {
                expect(id).to.eql(3);
            });
            it('should add new company', function ()
            {
                expect(companies).to.eql(data.afterRegisterCompany);
            });

        });
        describe('when company data is not valid', function ()
        {
            describe('when name is invalid', function ()
            {
                beforeEach(function ()
                {
                    let invalidCompany = _.omit(company, ['name']);

                    return companyDAO.addCompanyRegister(invalidCompany).then(function ()
                    {
                        throw new Error('function then should not be served');
                    }).catch(function ()
                    {
                        return companyDAO.getCompanies().then(function (result)
                        {
                            companies = result;
                        })
                    });
                });
                it('should not add company', function ()
                {
                    expect(companies).to.eql([data.companies[0], data.companies[1]]);
                });
            });
            describe('when nip is valid', function ()
            {
                beforeEach(function ()
                {
                    let invalidCompany = _.omit(company, ['nip']);

                    return companyDAO.addCompanyRegister(invalidCompany).then(function ()
                    {
                        throw new Error('function then should not be served');
                    }).catch(function ()
                    {
                        return companyDAO.getCompanies().then(function (result)
                        {
                            companies = result;
                        })
                    });
                });
                it('should not add company', function ()
                {
                    expect(companies).to.eql([data.companies[0],data.companies[1]]);
                });
            });
        });
    });

    describe('getNips', function ()
    {
        let nips = [];
        describe('when nip valid to more then one', function ()
        {
            beforeEach(function ()
            {
                return companyDAO.getNips(102).then(result => {
                    nips = result;
                })
            });
            it('should return array of nips', function ()
            {
                expect(nips).to.eql([{name: data.companies[0].name, nip: data.companies[0].nip}, {name: data.companies[1].name, nip: data.companies[1].nip}]);
            });
        });
        describe('when nip valid to one', function ()
        {
            beforeEach(function ()
            {
                return companyDAO.getNips(10293).then(result => {
                    nips = result;
                })
            });
            it('should return array of nips', function ()
            {
                expect(nips).to.eql([{name: data.companies[0].name, nip: data.companies[0].nip}]);
            });
        });

    });

    describe('getCompanyById', function ()
    {
        beforeEach(function ()
        {
            return companyDAO.getCompanyById(1).then(result => {
                companies = result;
            })
        });
        it('should return company', function ()
        {
            expect(companies).to.eql(data.companies[0]);
        });
    });
});
