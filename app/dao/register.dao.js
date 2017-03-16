'use strict';
const db = require('../services/db.connect');


function registerUserCompany(person)
{

    let sql = 'INSERT INTO users (email, password) values ($1,$2) returning id';

    return db.one(sql, [person.email, person.password]).then(data =>
    {
        person.id = data.id;
        return db.none('INSERT INTO company (name,nip,users) values($1,$2,$3)', [person.name, person.nip, person.id]).then(() =>
        {

        }).catch(error =>
        {
            db.none('DELETE FROM users WHERE id = $1', [data.id]);
            return error
        });
    }).catch(error =>
    {

        return error;
    });
}

function checkUser(person)
{
    return db.oneOrNone('SELECT id FROM users WHERE email = $1', [person.email]).then(result =>
    {
        console.log('result', result);
        return result;
    });
}

function checkNip(nip)
{
    return db.oneOrNone('SELECT nip FROM company WHERE nip = $1', [nip]).then(result =>
    {
        return result;
    }).catch(error =>
    {
        return error;
    })
}

module.exports = {
    registerUserCompany,
    checkUser,
    checkNip
};
