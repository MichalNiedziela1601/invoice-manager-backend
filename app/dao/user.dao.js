'use script';
const db = require('../services/db.connect');

function checkUser(person)
{
    return db.oneOrNone('SELECT id FROM users WHERE email = $1', [person.email]).then(result =>
    {
        return result;
    });
}

module.exports = {
    checkUser
};
