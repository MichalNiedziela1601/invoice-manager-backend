'use strict';

const expect = require('chai').expect;
const userDAO = require('../../app/dao/user.dao');
const data = require('../fixtures/login.dao.fixtures');
const testHelper = require('../testHelper');
let promiseResult = {};

describe('user.dao', function ()
{
    beforeEach(function ()
    {
        return testHelper.clearDB().then(() =>
        {
            return testHelper.seed('test/seed/login.dao.sql');
        })
    });

    describe('getUserByEmail', function ()
    {
        describe('when found user', function ()
        {
            beforeEach(function ()
            {
                return userDAO.getUserByEmail('test@gmail.com').then(result =>
                {
                    promiseResult = result;
                });
            });
            it('should return user email and companyId', function ()
            {
                expect(promiseResult).eql({email: data.getUser[0].email, companyId: data.getUser[0].companyId});
            });
        });
        describe('when not found user', function ()
        {
            beforeEach(function ()
            {
                return userDAO.getUserByEmail('jack@gmail.com').catch(result =>
                {
                    promiseResult = result;
                })
            });
            it('should throw error NOT_FOUND', function ()
            {
                expect(promiseResult).eql({
                    'error': {
                        'code': 404,
                        'message': 'NOT_FOUND'
                    },
                    'message': 'User not found'
                });
            });
        });
    });

    describe('addUser', function ()
    {
        describe('when add user successfully', function ()
        {
            beforeEach(function ()
            {
                return userDAO.addUser({email: 'quest@gmail.com', password: '$8908909sfs0f0sf0s', companyId: 2}).then(() =>
                {
                    return userDAO.getUserByEmail('quest@gmail.com').then(result =>
                    {
                        promiseResult = result;
                    });
                });

            });
            it('should add new user', function ()
            {
                expect(promiseResult).eql({
                    'companyId': 2,
                    'email': 'quest@gmail.com'
                })
            });
        });
        describe('when user exist in database', function ()
        {
            beforeEach(function ()
            {
                return userDAO.addUser(data.getUser[1]).catch(result =>
                {
                    promiseResult = result;
                });
            });
            it('should throw error', function ()
            {
                expect(promiseResult.error).eql(
                        {
                            'code': 500,
                            'message': 'ERROR'
                        }
                );
            });
        });
    });
});
