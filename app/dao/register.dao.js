'use strict';
const db = require('../services/db.connect');


function registerUserCompany(person)
{
    let query = 'INSERT INTO company (name,nip) values($1,$2) returning id';
    let sql = 'INSERT INTO users (email, password,company_id) values ($1,$2,$3)';
    return db.one(query, [person.name, person.nip]).then(data =>
    {
        person.id = data.id;
        return db.none(sql, [person.name, person.password, person.id]).then(() =>
        {

        }).catch(error =>
        {
            db.none('DELETE FROM company WHERE id = $1', [data.id]);
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
