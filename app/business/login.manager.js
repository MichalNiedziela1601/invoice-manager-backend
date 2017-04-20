'use strict';
const loginDAO = require('../dao/login.dao');
const bcrypt = require('bcrypt');
const token = require('../services/token');
const companyDAO = require('../dao/company.dao');
const userDAO = require('../dao/user.dao');

//TODO rename this file to userManager

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
        return bcrypt.compare(password.toString(), hash.password.toString()).then(res =>
        {
            return res;
        });
    });
}

function login(person)
{
    return getUser(person.email).then(result =>
    {
        return checkPassword(person.email, person.password).then(hash =>
        {
            if (hash) {
                return token(result);
            } else {
                throw new Error('Password not match')
            }
        })

    }, () =>
    {
        throw new Error('user not found');
    }).catch(error =>
    {
        throw error;
    });
}

function getUserInformation(email)
{
    return userDAO.getUserByEmail(email).then(result =>
    {
        return result.companyId;
    }).then(companyId =>
    {
        return companyDAO.getCompanyById(companyId).then(company =>
        {
            return company.nip;
        })
    })
            .then(nip =>
            {
                return companyDAO.getCompanyDetails(nip).then(company =>
                {
                    return company;
                })
            })
            .catch(error =>
            {
                console.log(error);
            })
}

module.exports = {
    getUser, checkPassword, login, getUserInformation
};
