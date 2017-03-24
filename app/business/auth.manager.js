'use strict';
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
    let userTemp = {};
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
                        userTemp = user;
                        return companyDAO.addCompanyRegister(user);

                    }).then(company =>
                    {
                        userTemp.companyId = company;
                        return userDAO.addUser(userTemp);
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
