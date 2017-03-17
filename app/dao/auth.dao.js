'use strict';
const db = require('../services/db.connect');


function registerCompany(person)
{
    let addCompany = 'INSERT INTO company (name,nip) values($1,$2) returning id';
    let addUser = 'INSERT INTO users (email, password,company_id) values ($1,$2,$3)';
    return db.one(addCompany, [person.name, person.nip]).then(data =>
    {
        return db.none(addUser, [person.email, person.password, data.id]).then(() =>
        {

        }).catch(error =>
        {
            db.none('DELETE FROM company WHERE id = $1', [data.id]);
            console.error('ERROR auth.dao.registerCompany:', error.message || error);
            throw error;
        });
    }).catch(error =>
    {
        console.error('ERROR auth.dao.registerCompany:',error.message || error);
        throw error;
    });
}

module.exports = {
    registerCompany
};
