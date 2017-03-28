'use strict';
const db = require('../services/db.connect');

function getUserByEmail(email)
{
    return db.one('SELECT id FROM users WHERE email = $1', [email]).then(result =>
    {
        return result;
    })
}
function getUserById(id)
{
    return db.one('SELECT * FROM users WHERE id = $1', [id]).then(result =>
    {
        return result;
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
        console.error('ERROR auth.dao.registerCompany:', error.message || error);
        throw error;
    });
}


module.exports = {
    getUserByEmail,
    addUser,
    getUserById
};
