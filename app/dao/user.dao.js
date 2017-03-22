'use script';
const db = require('../services/db.connect');

function getUserByEmail(email)
{
    return db.one('SELECT id FROM users WHERE email = $1', [email]).then(result =>
    {
        return result;
    })
}


module.exports = {
    getUserByEmail
};
