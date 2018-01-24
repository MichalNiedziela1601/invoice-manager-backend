'use strict';

const expect = require('chai').expect;
const addressDAO = require('../../app/dao/address.dao');
const data = require('../fixtures/address.dao.fixture');
const testHelper = require('../testHelper');
let result = null;
const _ = require('lodash');
describe('address.dao', function ()
{
    let addresses = [];
    let errorMock = null;

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
            return addressDAO.getAddressById(1).then(address =>
            {
                addresses = address;
            })
        });
        it('should return address', function ()
        {
            expect(addresses).to.eql(data.addresses[0]);
        });
    });
    describe('when error', function ()
    {
        beforeEach(function ()
        {
            return addressDAO.getAddressById(9).catch(error =>
            {
                errorMock = error;
            })
        });
        it('should throw error', function ()
        {
            expect(errorMock).deep.eql({
                error: {message: 'NOT_FOUND', code: 404},
                message: 'Address not found'
            });
        });
    });

    describe('updateAddress', function ()
    {
        beforeEach(function ()
        {
            let updateAddress = {
                id: 1,
                street: 'Tuchowska',
                buildNr: '4',
                flatNr: '5',
                postCode: '33-100',
                city: 'Tarnów',
                country: 'Poland',
                countryCode: 'PL'
            };

            return addressDAO.updateAddress(updateAddress, updateAddress.id).then(() =>
            {
                return addressDAO.getAddressById(1).then(address =>
                {
                    addresses = address;
                });
            });
        });
        it('should update address', function ()
        {
            expect(addresses).eql(data.updateAddress[0]);
        });
    });

    describe('addAddress', function ()
    {
        let addresMock = {
            street: 'bla',
            buildNr: '5',
            flatNr: '5a',
            postCode: '4498gg',
            city: 'Where',
            country: 'Poland',
            countryCode: 'PL'
        };
        describe('when added succesfully', function ()
        {
            beforeEach(function ()
            {
                return addressDAO.addAddress(addresMock).then(id =>
                {
                    return addressDAO.getAddressById(id).then(address =>
                    {
                        result = address;
                    });
                });
            });
            it('should add new address', function ()
            {
                expect(result).eql(data.addressAdd);
            });
        });

        describe('when something wrong', function ()
        {
            beforeEach(function ()
            {
                addresMock = _.omit(addresMock,'street');
                return addressDAO.addAddress(addresMock).catch(error => {
                    result = error;
                });
            });
            it('should throw error', function ()
            {
                expect(result.error.message).eql('PRECONDITION_FAILED');
            });
        });
    });
});
