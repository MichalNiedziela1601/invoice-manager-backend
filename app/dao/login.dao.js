'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');

function getUser(email)
{
    return db.one('select * from users where email = $1', [email]).then(result =>
    {
        return parser.parseObj(result);
    })
            .catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
            });
}

function checkPassword(email)
{
    let sql = 'SELECT password FROM users WHERE email = $1';

    return db.one(sql, [email]).then(result =>
    {
        return result;
    }).catch(() =>
    {
        throw applicationException.new(applicationException.NOT_FOUND, 'Password not found');
    });
}

module.exports = {
    getUser,
    checkPassword
};
