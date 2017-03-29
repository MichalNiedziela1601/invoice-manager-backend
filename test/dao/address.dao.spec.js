'use strict';

const expect = require('chai').expect;
const addressDAO = require('../../app/dao/address.dao');
const data = require('../fixtures/address.dao.fixture');
const testHelper = require('../testHelper');

describe('address.dao', function ()
{
    let addresses = [];

    beforeEach(function ()
    {
        addresses = [];
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/address.dao.sql')
        });
    });

    describe('getAddressById', function ()
    {
        beforeEach(function ()
        {
            return addressDAO.getAddressById(1).then(address => {
                addresses = address;
            })
        });
        it('should return address', function ()
        {
            expect(addresses).to.eql(data.addresses[0]);
        });
    });
});
