'use script';
const db = require('../services/db.connect');

function checkUser(person)
{
    return db.oneOrNone('SELECT id FROM users WHERE email = $1', [person.email]).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.error('ERROR user.dao.checkUser:', error.message || error);
        throw error;
    });
}

module.exports = {
    checkUser
};
