'use script';
const db = require('../services/db.connect');

function getUserByEmail(person)
{
    return db.oneOrNone('SELECT id FROM users WHERE email = $1', [person.email]).then(result =>
    {
        console.log(result);
        if (result == null) {
         throw new ERROR('Email dont exsist');
        } else {
            return result;
        }
    }).catch(error =>
    {
        console.error('ERROR user.dao.getUserByEmail:', error.message || error);
        throw error;
    });
}


module.exports = {
    getUserByEmail
};
