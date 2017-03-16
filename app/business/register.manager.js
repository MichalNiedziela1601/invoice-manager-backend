'use strict';
const registerDAO = require('../dao/register.dao');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const _ = require('lodash');


function registerUserCompany(person)
{
    let answer = {};
    return registerDAO.checkUser(person).then(result =>
    {
        if (result === null) {
            return registerDAO.checkNip(person.nip).then(nip =>
            {
                if (nip === null) {
                    const saltCounts = 10;

                    return bcrypt.hash(person.password, saltCounts).then(hash =>
                    {
                        person.password = hash;
                        console.log('person', person);
                        return person;

                    }).then(user =>
                    {
                        return registerDAO.registerUserCompany(user);
                    })
                            .then(() =>
                            {
                                return Promise.resolve();
                            })
                            .catch(error =>
                            {
                                answer.success = false;
                                answer.error = error;
                                return Promise.reject(answer);
                            });
                } else {
                    answer.success = false;
                    answer.error = 'Istnieje już taki nip w bazie danych';
                    return Promise.reject(answer);
                }
            })

        } else {
            answer.success = false;
            answer.error = 'Istnieje już taka nazwa użytkownika';
            return Promise.reject(answer);
        }
    });
}

module.exports = {
    registerUserCompany
};
