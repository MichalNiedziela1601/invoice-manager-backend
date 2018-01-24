'use strict';

const expect = require('chai').expect;
const loginDAO = require('../../app/dao/login.dao');
const data = require('../fixtures/login.dao.fixtures');
const testHelper = require('../testHelper');
let promiseResult = {};

describe('login.dao', function ()
{
    beforeEach(function ()
    {
        return testHelper.clearDB().then(() => {
            return testHelper.seed('test/seed/login.dao.sql');
        })
    });

    describe('getUser', function ()
    {
        describe('when get user', function ()
        {
            beforeEach(function ()
            {
                return loginDAO.getUser('test@gmail.com').then(result => {
                    promiseResult = result;
                });
            });
            it('should return user', function ()
            {
                expect(promiseResult).eql(data.getUser[0]);
            });
        });
        describe('when not found user', function ()
        {
            beforeEach(function ()
            {
                return loginDAO.getUser('anoter@wp.pl').catch(result => {
                    promiseResult = result;
                })
            });
            it('should throw error NOT FOUND', function ()
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

    describe('checkPassword', function ()
    {
        describe('when find user', function ()
        {
            beforeEach(function ()
            {
                return loginDAO.checkPassword('user@gmail.com').then(result => {
                    promiseResult = result;
                })
            });
            it('should return password', function ()
            {
                expect(promiseResult).eql({ password: data.getUser[1].password});
            });
        });
        describe('when not found user', function ()
        {
            beforeEach(function ()
            {
                return loginDAO.checkPassword('another@gmail.com').catch(result => {
                    promiseResult = result;
                })
            });
            it('should throw error NOT FOUND', function ()
            {
                expect(promiseResult).eql({
                    'error': {
                        'code': 404,
                        'message': 'NOT_FOUND'
                    },
                    'message': 'Password not found'
                })
            });
        });
    });
});
