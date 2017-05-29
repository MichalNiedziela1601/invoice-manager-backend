'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

let resultPromise = null;
const _ = require('lodash');
let personDAOMock = {
    findPersonBySurname: sinon.spy(),
    getPersonById: sinon.stub(),
    addPerson: sinon.stub(),
    findShortcut: sinon.stub(),
    findByNip: sinon.stub(),
    getPersons: sinon.stub(),
    updatePerson: sinon.stub()
};

let addressDAOMock = {
    getAddressById: sinon.stub(),
    updateAddress: sinon.stub(),
    addAddress: sinon.stub()
};

let personManager = proxyquire('../../app/business/person.manager', {
    '../dao/person.dao': personDAOMock, '../dao/address.dao': addressDAOMock
});

describe('personManager', function ()
{
    describe('findPersonBySurname', function ()
    {
        before(() =>
        {
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
        before(() =>
        {
            personDAOMock.getPersonById.reset();
            addressDAOMock.getAddressById.reset();
            personDAOMock.getPersonById.resolves({id: 1, firstName: 'John', lastName: 'Smith', addressId: 1});
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

    describe('addPerson', function ()
    {
        describe('when successfully added', function ()
        {
            before(() =>
            {
                addressDAOMock.addAddress.reset();
                addressDAOMock.addAddress.resolves(2);
                personDAOMock.addPerson.reset();
                personDAOMock.addPerson.resolves();

                personManager.addPerson({address: {street: 'nowa'}});
            });
            it('should call addAddress', function ()
            {
                expect(addressDAOMock.addAddress).callCount(1);
                expect(addressDAOMock.addAddress).calledWith({street: 'nowa'});
            });
            it('should call addPerson', function ()
            {
                expect(personDAOMock.addPerson).callCount(1);
                expect(personDAOMock.addPerson).calledWith({address: {street: 'nowa'}, addressId: 2});
            });
        });

        describe('when throw error', function ()
        {
            before(() =>
            {
                addressDAOMock.addAddress.reset();
                addressDAOMock.addAddress.resolves(2);
                personDAOMock.addPerson.reset();
                personDAOMock.addPerson.rejects();

                return personManager.addPerson({address: {street: 'nowa'}}).catch(error =>
                {
                    resultPromise = error;
                });
            });
            it('should call addAddress', function ()
            {
                expect(addressDAOMock.addAddress).callCount(1);
                expect(addressDAOMock.addAddress).calledWith({street: 'nowa'});
            });
            it('should throw error', function ()
            {
                expect(resultPromise.error).eql({
                    code: 500,
                    message: 'ERROR'
                });
            });
        });
    });

    describe('findShortcut', function ()
    {
        before(() =>
        {
            personDAOMock.findShortcut.resolves();

            personManager.findShortcut({shortcut: 'ble'});
        });
        it('should call personDAO.findShortcut', function ()
        {
            expect(personDAOMock.findShortcut).callCount(1);
            expect(personDAOMock.findShortcut).calledWith({shortcut: 'ble'});
        });
    });

    describe('findByNip', function ()
    {
        before(() =>
        {
            personDAOMock.findByNip.resolves();

            personManager.findByNip(1234567890);
        });
        it('should call personDAO.findByNip', function ()
        {
            expect(personDAOMock.findByNip).callCount(1);
            expect(personDAOMock.findByNip).calledWith(1234567890);
        });
    });

    describe('getPersons', function ()
    {
        describe('when found persons', function ()
        {
            before(() =>
            {
                let persons = [
                    {addressId: 1},
                    {addressId: 2}
                ];
                addressDAOMock.getAddressById.reset();
                personDAOMock.getPersons.resolves(persons);
                addressDAOMock.getAddressById.withArgs(1).resolves({street: 'fake'});
                addressDAOMock.getAddressById.withArgs(2).resolves({street: 'fake2'});

                personManager.getPersons();
            });
            it('should call getPersons', function ()
            {
                expect(personDAOMock.getPersons).callCount(1);
            });
            it('should call addressDAO.getAddressById', function ()
            {
                expect(addressDAOMock.getAddressById).callCount(2);
                expect(addressDAOMock.getAddressById).calledWith(1);
                expect(addressDAOMock.getAddressById).calledWith(2);
            });
        });
        describe('when not found persons', function ()
        {
            before(() =>
            {
                personDAOMock.getPersons.reset();
                personDAOMock.getPersons.rejects();

                return personManager.getPersons().catch(error =>
                {
                    resultPromise = error;
                });
            });
            it('should throw error', function ()
            {
                expect(resultPromise.error).eql({code: 404, message: 'NOT_FOUND'});
            });
        });
    });

    describe('updatePerson', function ()
    {
        before(() =>
        {
            addressDAOMock.updateAddress.resolves();
            personDAOMock.updatePerson.resolves();

            personManager.updatePerson({addressId: 1, address: {street: 'fake'}});
        });
        it('should call personDAO.updatePerson', function ()
        {
            expect(personDAOMock.updatePerson).callCount(1);
            expect(personDAOMock.updatePerson).calledWith({addressId: 1, address: {street: 'fake'}});
        });
        it('should call addressDAO.updateAddress', function ()
        {
            expect(addressDAOMock.updateAddress).callCount(1);
            expect(addressDAOMock.updateAddress).calledWith({street: 'fake'},1);
        });
    });
});
