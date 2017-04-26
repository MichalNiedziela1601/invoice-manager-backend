'use strict';
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;
const applicationExceptionMock = require('../../app/services/applicationException');
const isMock = sinon.spy(applicationExceptionMock,'is');
const newMock = sinon.spy(applicationExceptionMock,'new');
let result = {};
let errorStub = new Error('Custom error');
let codeMock = sinon.spy();
let replyMock = sinon.spy(function(){
    return {
        code: codeMock
    }
});

describe('applicationException', function ()
{
    describe('is', function ()
    {

        describe('when error is not of instance ApplicationError', function ()
        {
            before(function(){
                result = applicationExceptionMock.is(errorStub,applicationExceptionMock.NOT_FOUND);
            });
            it('should call is function', function ()
            {
                expect(isMock).callCount(1);
            });
            it('should return false', function ()
            {
                expect(result).eql(false);
            });
        });
        describe('when error is instanceof ApplicationError', function ()
        {
            before(() => {
                errorStub = applicationExceptionMock.new(applicationExceptionMock.CONFLICT);
                result = applicationExceptionMock.is(errorStub,applicationExceptionMock.CONFLICT);
            });
            it('should return true', function ()
            {
                expect(result).eql(true);
            });
        });
    });

    describe('new', function ()
    {
        before(() => {
            newMock.reset();
            result = applicationExceptionMock.new(applicationExceptionMock.ERROR,'Unknow');
        });
        it('should call new function', function ()
        {
            expect(newMock).callCount(1);
        });
        it('should return new object', function ()
        {
            expect(result).a('object');
        });
        it('should have error and message property', function ()
        {
            expect(result).all.keys('error','message');
        });
    });
    describe('errorHandler', function ()
    {
        describe('when error is instanceof ApplicationException', function ()
        {
            before(() => {
                errorStub = applicationExceptionMock.new(applicationExceptionMock.NOT_FOUND,'User not found');
                applicationExceptionMock.errorHandler(errorStub,replyMock);
            });
            it('should call reply', function ()
            {
                expect(replyMock).callCount(1);
            });
            it('should call reply with error.message', function ()
            {
                expect(replyMock).calledWith('User not found');
            });
            it('should call reply with code error', function ()
            {
                expect(codeMock).callCount(1);
                expect(codeMock).calledWith(404);
            });
        });
        describe('when error is not instanceof ApplicationException', function ()
        {
            before(() => {
                replyMock.reset();
                codeMock.reset();
                errorStub = new Error('Unknown error');
                applicationExceptionMock.errorHandler(errorStub,replyMock);
            });
            it('should call reply', function ()
            {
                expect(replyMock).callCount(1);
            });

            it('should call reply with code 500', function ()
            {
                expect(codeMock).callCount(1);
                expect(codeMock).calledWith(500);
            });
        });
    });
});
