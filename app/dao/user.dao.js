'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');

function getUserByEmail(email)
{
    return db.one('SELECT email,company_id FROM users WHERE email = $1', [email]).then(result =>
    {
        return parser.parseObj(result);
    }).catch(() => {
        throw applicationException.new(applicationException.NOT_FOUND,'User not found');
    })
}

function addUser(person)
{
    let user = 'INSERT INTO users (email, password,company_id) values ($1,$2,$3)';

    return db.none(user, [person.email, person.password, person.companyId]).then(() =>
    {

    }).catch(error =>
    {
        db.none('DELETE FROM company WHERE id = $1', [person.companyId]);
        throw applicationException.new(applicationException.ERROR,error);
    });
}


module.exports = {
    getUserByEmail,
    addUser
};
