'use strict';

const expect = require('chai').expect;
const companyDAO = require('../../app/dao/company.dao');
const data = require('../fixtures/company.dao.json');
const testHelper = require('../testHelper');

beforeEach(function ()
{
    return testHelper.clearDB().then(function ()
    {
        return testHelper.seed('test/seed/company.dao.sql');
    });
});

describe('company.dao', function ()
{
    describe('getCompanies', function ()
    {
        let companies = [];
        beforeEach(function ()
        {
            return companyDAO.getCompanies().then(function (result)
            {
                companies = result;
            })
        });

        it('should return all companies', function ()
        {
            expect(companies).to.eql(data.companies);
        });
    });
});
