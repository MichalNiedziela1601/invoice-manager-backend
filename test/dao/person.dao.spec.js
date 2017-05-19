'use strict';

const expect = require('chai').expect;
const personDAO = require('../../app/dao/person.dao');
const data = require('../fixtures/person.dao.fixtures');
const testHelper = require('../testHelper');

let result = {};


describe('', function ()
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
                return personDAO.findPersonBySurname('cvlcv').then(person => {
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
            return personDAO.addFolderId('wrwewq34w4',1).then(() => {
                return personDAO.getPersonById(1).then(person => {
                    result = person;
                });
            });
        });
        it('should add google id', function ()
        {
            expect(result).eql(data.personAfterAddFolder);
        });
    });
});
