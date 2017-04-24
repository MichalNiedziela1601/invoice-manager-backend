'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getUser(email)
{
    return db.one('select * from users where email = $1', [email]).then(result =>
    {
        return parser.parseObj(result);
    });
}

function checkPassword(email)
{
    let sql = 'SELECT password FROM users WHERE email = $1';

    return db.one(sql, [email]).then(result =>
    {
        return result;
    });
}

module.exports = {
    getUser,
    checkPassword
};
