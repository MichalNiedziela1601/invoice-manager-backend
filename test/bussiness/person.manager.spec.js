'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

let personDAOMock = {
    findPersonBySurname: sinon.spy(),
    getPersonById: sinon.stub()
};

let addressDAOMock = {
    getAddressById: sinon.stub()
};

let personManager = proxyquire('../../app/business/person.manager', {
    '../dao/person.dao': personDAOMock, '../dao/address.dao': addressDAOMock
});

describe('personManager', function ()
{
    describe('findPersonBySurname', function ()
    {
        before(() => {
            personManager.findPersonBySurname('Smith');
        });
        it('should call findPersonBySurname', function ()
        {
            expect(personDAOMock.findPersonBySurname).callCount(1);
            expect(personDAOMock.findPersonBySurname).calledWith('Smith');
        });
    });

    describe('getPersonById', function ()
    {
        before(() => {
            personDAOMock.getPersonById.reset();
            addressDAOMock.getAddressById.reset();
            personDAOMock.getPersonById.resolves({id: 1,firstName: 'John', lastName: 'Smith', addressId: 1});
            addressDAOMock.getAddressById.resolves({id: 1, street: 'Main'});

            personManager.getPersonById(1);
        });
        it('should call getPersonById', function ()
        {
            expect(personDAOMock.getPersonById).callCount(1);
            expect(personDAOMock.getPersonById).calledWith(1);
        });
        it('should call getAddressById', function ()
        {
            expect(addressDAOMock.getAddressById).callCount(1);
            expect(addressDAOMock.getAddressById).calledWith(1);
        });
    });
});
