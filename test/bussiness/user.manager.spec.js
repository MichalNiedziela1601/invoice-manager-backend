'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;

const loginDAOMock = {
    getUser: sinon.stub(),
    checkPassword: sinon.stub()
};

const bcrypt = {
    hash: sinon.stub(),
    compare: sinon.stub()
};

const companyDAOMock = {
    getCompanyById: sinon.stub(),
    updateAccount: sinon.stub()
};

const userDAOMock = {
    getUserByEmail: sinon.stub(),
    addUser: sinon.stub()
};

const companyManagerMock = {
    getCompanyById: sinon.stub()
};

let userManager = proxyquire('../../app/business/user.manager', {
    '../dao/company.dao.js': companyDAOMock,
    '../dao/login.dao': loginDAOMock,
    'bcrypt': bcrypt,
    '../dao/company.dao': companyDAOMock,
    '../dao/user.dao': userDAOMock,
    './company.manager': companyManagerMock
});

let userMock = {
    email: 'test@mail.com',
    companyId: 2
};

let companyMock = {
    id: 2, name: 'Test', nip: 1234567890
};

let promiseResult = {};

describe('user.manager', function ()
{
    describe('getUser', function ()
    {
        before(() =>
        {
            loginDAOMock.getUser.resolves(userMock);
            companyDAOMock.getCompanyById.resolves(companyMock);
            return userManager.getUser(userMock.email);
        });
        it('should call loginDAO.getUser', function ()
        {
            expect(loginDAOMock.getUser).callCount(1);
            expect(loginDAOMock.getUser).calledWith('test@mail.com');
        });
        it('should call companyDAO.getCompanyById', function ()
        {
            expect(companyDAOMock.getCompanyById).callCount(1);
            expect(companyDAOMock.getCompanyById).calledWith(2);
        });
    });

    describe('checkPassword', function ()
    {
        let hash = {password: '$2a$10$GCmogKVVt1YPacqjzMwF0eHJJtu2dEGmvIE9mUV7G4xxG9xmTo3i2'};
        describe('when password match', function ()
        {
            before(() =>
            {
                loginDAOMock.checkPassword.resolves(hash);
                bcrypt.compare.resolves(true);
                return userManager.checkPassword('test@mail.com', 'qwert').then(result =>
                {
                    promiseResult = result;
                });
            });
            it('should call loginDAO.checkPassword', function ()
            {
                expect(loginDAOMock.checkPassword).callCount(1);
                expect(loginDAOMock.checkPassword).calledWith('test@mail.com');
            });
            it('should call bcrypt.compare', function ()
            {
                expect(bcrypt.compare).callCount(1);
                expect(bcrypt.compare).calledWith('qwert', hash.password);
            });
            it('should return true', function ()
            {
                expect(promiseResult).eql(true);
            });
        });

        describe('when password not match', function ()
        {
            before(() =>
            {
                loginDAOMock.checkPassword.reset();
                bcrypt.compare.reset();
                loginDAOMock.checkPassword.resolves(hash);
                bcrypt.compare.resolves(false);
                return userManager.checkPassword('test@mail.com', 'qwert').then(result =>
                {
                    promiseResult = result;
                });
            });
            it('should call loginDAO.checkPassword', function ()
            {
                expect(loginDAOMock.checkPassword).callCount(1);
                expect(loginDAOMock.checkPassword).calledWith('test@mail.com');
            });
            it('should call bcrypt.compare', function ()
            {
                expect(bcrypt.compare).callCount(1);
                expect(bcrypt.compare).calledWith('qwert', hash.password);
            });
            it('should return true', function ()
            {
                expect(promiseResult).eql(false);
            });
        });
    });

    describe('authenticate', function ()
    {
        let hash = {password: '$2a$10$GCmogKVVt1YPacqjzMwF0eHJJtu2dEGmvIE9mUV7G4xxG9xmTo3i2'};
        describe('when user authenticated', function ()
        {
            before(() =>
            {
                loginDAOMock.checkPassword.reset();
                bcrypt.compare.reset();
                loginDAOMock.getUser.reset();
                companyDAOMock.getCompanyById.reset();
                loginDAOMock.getUser.resolves(userMock);
                companyDAOMock.getCompanyById.resolves(companyMock);
                loginDAOMock.checkPassword.resolves(hash);
                bcrypt.compare.resolves(true);
                return userManager.authenticate({email: 'test@mail.com', password: 'qwert'}).then(result =>
                {
                    promiseResult = result;
                });
            });
            it('should call loginDAO.getUser', function ()
            {
                expect(loginDAOMock.getUser).callCount(1);
                expect(loginDAOMock.getUser).calledWith('test@mail.com');
            });
            it('should call companyDAO.getCompanyById', function ()
            {
                expect(companyDAOMock.getCompanyById).callCount(1);
                expect(companyDAOMock.getCompanyById).calledWith(2);
            });
            it('should call loginDAO.checkPassword', function ()
            {
                expect(loginDAOMock.checkPassword).callCount(1);
                expect(loginDAOMock.checkPassword).calledWith('test@mail.com');
            });
            it('should call bcrypt.compare', function ()
            {
                expect(bcrypt.compare).callCount(1);
                expect(bcrypt.compare).calledWith('qwert', hash.password);
            });
            it('should return userinfo', function ()
            {
                expect(promiseResult).eql({
                    'company': {
                        id: 2,
                        name: 'Test',
                        'nip': 1234567890
                    },
                    'companyId': 2,
                    'email': 'test@mail.com'
                });
            });
        });

        describe('when email not exist in database', function ()
        {
            before(() =>
            {
                loginDAOMock.checkPassword.reset();
                bcrypt.compare.reset();
                loginDAOMock.getUser.reset();
                companyDAOMock.getCompanyById.reset();
                loginDAOMock.getUser.rejects();
                return userManager.authenticate({email: 'test@mail.com', password: 'qwert'}).catch(result =>
                {
                    promiseResult = result;
                });
            });
            it('should throw error', function ()
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

        describe('when password not match', function ()
        {
            before(() =>
            {
                loginDAOMock.checkPassword.reset();
                bcrypt.compare.reset();
                loginDAOMock.getUser.reset();
                companyDAOMock.getCompanyById.reset();
                loginDAOMock.getUser.resolves(userMock);
                companyDAOMock.getCompanyById.resolves(companyMock);
                loginDAOMock.checkPassword.resolves(hash);
                bcrypt.compare.resolves(false);
                return userManager.authenticate({email: 'test@mail.com', password: 'qwert'}).catch(result =>
                {
                    promiseResult = result;
                });
            });
            it('should throw error', function ()
            {
                expect(promiseResult).eql({
                    'error': {
                        'code': 412,
                        'message': 'PRECONDITION_FAILED'
                    },
                    'message': 'Password not match'
                });
            });
        });
    });

    describe('getUserInformation', function ()
    {
        before(() =>
        {
            companyMock.address = {id: 1, street: 'Far away', buildNr: 4};
            userDAOMock.getUserByEmail.reset();
            userDAOMock.getUserByEmail.resolves(userMock);
            companyManagerMock.getCompanyById.resolves(companyMock);
            return userManager.getUserInformation(userMock.email).then(result =>
            {
                promiseResult = result;
            });
        });
        it('should call userDAO.getUserByEmail', function ()
        {
            expect(userDAOMock.getUserByEmail).callCount(1);
            expect(userDAOMock.getUserByEmail).calledWith('test@mail.com');
        });
        it('should call companyManager.getCompanyById', function ()
        {
            expect(companyManagerMock.getCompanyById).callCount(1);
            expect(companyManagerMock.getCompanyById).calledWith(userMock.companyId);
        });
        it('should return user information', function ()
        {
            expect(promiseResult).eql(companyMock);
        });

    });

    describe('addNewUser', function ()
    {
        let hashedUser = {email: 'test@mail.com', password: '$8979879879DFSFSDF987sd'};
        let user = {email: 'test@mail.com', password: 'qwert'};
        describe('when successfully added new user', function ()
        {
            before(() =>
            {
                userDAOMock.getUserByEmail.reset();
                userDAOMock.getUserByEmail.rejects();
                userDAOMock.addUser.resolves();
                bcrypt.hash.resolves('$8979879879DFSFSDF987sd');
                return userManager.addNewUser(user);
            });
            it('should call getUserByEmail', function ()
            {
                expect(userDAOMock.getUserByEmail).callCount(1);
                expect(userDAOMock.getUserByEmail).calledWith('test@mail.com');
            });
            it('should call', function ()
            {
                expect(bcrypt.hash).callCount(1);
                expect(bcrypt.hash).calledWith('qwert', 10);
            });
            it('should call userDAO.addUser', function ()
            {
                expect(userDAOMock.addUser).callCount(1);
                expect(userDAOMock.addUser).calledWith(hashedUser);
            });
        });
        describe('when email exist in database', function ()
        {
            before(() =>
            {
                userDAOMock.getUserByEmail.reset();
                userDAOMock.getUserByEmail.resolves(userMock);
                return userManager.addNewUser(user).catch(result =>
                {
                    promiseResult = result;
                });
            });
            it('should throw error conflict', function ()
            {
                expect(promiseResult).eql({
                    'error': {
                        'code': 409,
                        'message': 'CONFLICT'
                    },
                    'message': 'Email exist in database'
                });
            });
        });
        describe('when addUser reject error', function ()
        {
            before(() => {
                userDAOMock.getUserByEmail.reset();
                userDAOMock.getUserByEmail.rejects();
                userDAOMock.addUser.rejects({data: 'Cannot add new user'});
                bcrypt.hash.resolves('$8979879879DFSFSDF987sd');
                return userManager.addNewUser(user).catch(result => {
                    promiseResult = result;
                });
            });
            it('should throw error', function ()
            {
                expect(promiseResult).eql({
                    'error': {
                        'code': 500,
                        'message': 'ERROR'
                    },
                    'message': {
                        'data': 'Cannot add new user'
                    }
                });
            });
        });
    });

    describe('updateAccount', function ()
    {
        let account = { bankName: 'Test', bankAccount: '678678687687687'};
        before(() => {
            companyDAOMock.updateAccount.resolves();
            return userManager.updateAccount(account,2);
        });
        it('should call companyDAO.updateAccount', function ()
        {
            expect(companyDAOMock.updateAccount).callCount(1);
            expect(companyDAOMock.updateAccount).calledWith(account,2);
        });
    });
});
