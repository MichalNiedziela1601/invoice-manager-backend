'use strict';

const expect = require('chai').expect;
const personDAO = require('../../app/dao/person.dao');
const data = require('../fixtures/person.dao.fixtures');
const testHelper = require('../testHelper');

let result = {};


describe('personDAO', function ()
{
    beforeEach(function ()
    {
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/person.dao.sql')
        });
    });

    describe('getPersonById', function ()
    {
        describe('when find person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.getPersonById(1).then(person =>
                {
                    result = person;
                })
            });
            it('should return person', function ()
            {
                expect(result).eql(data.person);
            });
        });
        describe('when not found person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.getPersonById(3).catch(person =>
                {
                    result = person;
                })
            });
            it('should return person', function ()
            {
                expect(result).eql({
                    error: {message: 'NOT_FOUND', code: 404},
                    message: 'Person not found'
                });
            });
        });
    });

    describe('findPersonBySurname', function ()
    {
        describe('when find person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findPersonBySurname('Kow').then(person =>
                {
                    result = person;
                });
            });
            it('should return person', function ()
            {
                expect(result).eql([{id: data.person.id, firstName: data.person.firstName, lastName: data.person.lastName}]);
            });
        });
        describe('when not find person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findPersonBySurname('cvlcv').then(person =>
                {
                    result = person;
                })
            });
            it('should return ampty array', function ()
            {
                expect(result).eql([]);
            });
        });
    });

    describe('addFolderId', function ()
    {
        beforeEach(function ()
        {
            return personDAO.addFolderId('wrwewq34w4', 1).then(() =>
            {
                return personDAO.getPersonById(1).then(person =>
                {
                    result = person;
                });
            });
        });
        it('should add google id', function ()
        {
            expect(result).eql(data.personAfterAddFolder);
        });
    });

    describe('addPerson', function ()
    {
        let personMock = {
            firstName: 'John',
            lastName: 'smith',
            shortcut: 'smithjohn',
            nip: null,
            bankName: 'BANK',
            bankAccount: '9878979879454545',
            addressId: 1
        };
        beforeEach(function ()
        {
            return personDAO.addPerson(personMock).then(() =>
            {
                return personDAO.getPersonById(3).then(person =>
                {
                    result = person;
                })
            })
        });
        it('should add person to database', function ()
        {
            expect(result).eql(data.personAdd)
        });
    });

    describe('findShortcut', function ()
    {
        describe('when find shortcut', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findShortcut({shortcut: 'KOWALJAN_KRK'}).then(id =>
                {
                    result = id;
                });
            });
            it('should return id', function ()
            {
                expect(result).eql([{id: 1}]);
            });
        });
        describe('when not found shortcut', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findShortcut({shortcut: 'KOWALJA'}).then(id =>
                {
                    result = id;
                });
            });
            it('should return empty array', function ()
            {
                expect(result).eql([]);
            });
        });
    });

    describe('findByNip', function ()
    {
        describe('when find person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findByNip('1234527890').then(person => {
                    result = person;
                });
            });
            it('should return person', function ()
            {
                expect(result).eql(data.person);
            });
        });

        describe('when not found person', function ()
        {
            beforeEach(function ()
            {
                return personDAO.findByNip(86867687686).catch(error => {
                    result = error;
                });
            });
            it('should throw error', function ()
            {
                expect(result.error.message).eql('NOT_FOUND');
            });
        });

    });

    describe('getPersons', function ()
    {
        beforeEach(function ()
        {
            return personDAO.getPersons().then(persons => {
                result = persons;
            });
        });
        it('should return persons', function ()
        {
            expect(result).eql(data.getPersons);
        });
    });

    describe('updatePerson', function ()
    {
        let personMock = {
            id: 1,
            firstName: 'Jan',
            lastName: 'Kowalski',
            nip: 1234527890,
            addressId: 1,
            shortcut: 'KOWALJAN_KRK',
            bankName: 'BANK',
            bankAccount: null,
            swift: null,
            googlePersonId: null
        };
        beforeEach(function ()
        {
            return personDAO.updatePerson(personMock).then(() => {
                return personDAO.getPersonById(1).then(person => {
                    result = person;
                });
            });
        });
        it('should update person', function ()
        {
            expect(result).eql(data.updatePerson);
        });
    });
});
