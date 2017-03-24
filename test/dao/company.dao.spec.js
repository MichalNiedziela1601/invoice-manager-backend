'use strict';

const expect = require('chai').expect;
const companyDAO = require('../../app/dao/company.dao');
const data = require('../fixtures/company.dao.fixtures');
const testHelper = require('../testHelper');
const _ = require('lodash');

describe('company.dao', function ()
{
    let companies = [];

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
            name: 'Firma badfghjklrtek',
            nip: 176543330,
            regon: 55343367,
            addressId: 1
        };
        let companyValidId = {id: 2};
        _.assign(companyValidId, company);

        describe('addCompany', function ()
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
        describe('if properties is invalid', function ()
        {
            describe('if company name is invalid', function ()
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
                    expect(companies).to.eql([data.companies[0]])
                });
            });
            describe('if company nip is invalid', function ()
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
                    expect(companies).to.eql([data.companies[0]])
                });
            });
        });
    });
});
