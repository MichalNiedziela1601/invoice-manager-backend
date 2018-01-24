'use strict';
const loginDAO = require('../dao/login.dao');
const bcrypt = require('bcrypt');
const companyDAO = require('../dao/company.dao');
const userDAO = require('../dao/user.dao');
const applicationException = require('../services/applicationException');
const companyManager = require('./company.manager');

function hashPassword(obj, password, salt)
{
    return bcrypt.hash(password, salt).then(hash =>
    {
        obj.password = hash;
        return obj;
    })
}

function getUser(email)
{
    let userInfo = {};
    return loginDAO.getUser(email).then(user =>
    {
        userInfo = user;
        return companyDAO.getCompanyById(user.companyId);
    }).then(company =>
    {
        userInfo.company = company;
        return userInfo;
    });
}


function checkPassword(email, password)
{
    return loginDAO.checkPassword(email).then(hash =>
    {
        return bcrypt.compare(password, hash.password).then(res =>
        {
            return res;
        });
    });
}

function authenticate(credentials)
{
    return getUser(credentials.email).then(result =>
    {
        return checkPassword(credentials.email, credentials.password).then(hash =>
        {
            if (hash) {
                return result;
            } else {
                throw applicationException.new(applicationException.PRECONDITION_FAILED, 'Password not match');
            }
        })

    }, () =>
    {
        throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
    })
}

function getUserInformation(email)
{
    return userDAO.getUserByEmail(email).then(result =>
    {
        return result.companyId;
    }).then(companyId =>
    {
        return companyManager.getCompanyById(companyId);
    });

}

function addNewUser(credentials)
{
    return userDAO.getUserByEmail(credentials.email).then(() =>
    {
        throw applicationException.new(applicationException.CONFLICT, 'Email exist in database');
    }, () =>
    {

        return hashPassword(credentials, credentials.password, 10)
                .then(user =>
                {
                    return userDAO.addUser(user);
                })
                .catch(error =>
                {
                    throw applicationException.new(applicationException.ERROR, error);
                });
    })
}

function updateAccount(account,companyId)
{
    return companyDAO.updateAccount(account,companyId);
}

module.exports = {
    getUser, checkPassword, authenticate, getUserInformation, addNewUser,updateAccount
};
