'use strict';
const authDAO = require('../dao/auth.dao.js');
const bcrypt = require('bcrypt');
const companyDAO = require('../dao/company.dao');
const userDAO = require('../dao/user.dao');

function hashPassword(obj, password, salt)
{
    return bcrypt.hash(password, salt).then(hash =>
    {
        obj.password = hash;
        return obj;
    })
}
function registerCompany(person)
{
    return userDAO.getUserByEmail(person.email).then(() =>
    {
        throw new Error('Email exist in database');
    }, () =>
    {
        return companyDAO.getCompanyByNip(person.nip).then(() =>
        {
            throw new Error('Nip exist in database');
        }, () =>
        {
            return hashPassword(person, person.password, 10)
                    .then(user =>
                    {
                        return authDAO.registerCompany(user);
                    })
                    .catch(error =>
                    {
                        console.error('ERROR auth.manager.hashPassword:', error.message || error);
                        throw error;
                    });
        })
    })
}

module.exports = {
    registerCompany
};
