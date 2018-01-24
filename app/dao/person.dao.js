'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');

function getPersonById(id)
{
    return db.one('SELECT * FROM person WHERE id = $1', [id]).then(person => parser.parseObj(person))
            .catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'Person not found')
            });
}

function findPersonBySurname(lastName)
{
    lastName = lastName[0].toUpperCase() + lastName.slice(1);
    return db.any('SELECT id, first_name,last_name FROM person WHERE last_name like \'%$1#%\' OR shortcut like upper(\'%$1#%\')', [lastName])
            .then(companies =>
            {
                return parser.parseArrayOfObject(companies);
            });
}

function addFolderId(folderId, id)
{
    return db.none('UPDATE person SET google_person_id = $1 WHERE id = $2', [folderId, id]).then(() =>
    {
        return folderId;
    });
}

function addPerson(person)
{
    person.lastName = person.lastName[0].toUpperCase() + person.lastName.slice(1);
    person.shortcut = person.shortcut.toUpperCase();
    return db.one('INSERT INTO person (first_name,last_name,shortcut,address_id, nip, bank_accounts) VALUES ($1,$2,$3,$4,$5,$6) returning id',
            [person.firstName, person.lastName, person.shortcut, person.addressId, person.nip, person.bankAccounts]);
}

function findShortcut(filter)
{
    return db.any('SELECT id FROM person WHERE shortcut = $1', [filter.shortcut.toUpperCase()]);
}

function findByNip(nip)
{
    return db.one('SELECT * FROM person WHERE nip::text = $1', [nip])
            .then(person =>
            {
                return parser.parseObj(person);
            }).catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'Person not found')
            });
}

function getPersons()
{
    let sql = 'SELECT * FROM person';
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);
    });
}

function updatePerson(person)
{
    return db.none('UPDATE person SET first_name = $2, last_name = $3, nip = $4, bank_accounts = $5 WHERE id = $1',
            [person.id, person.firstName, person.lastName, person.nip, person.bankAccounts]);
}

module.exports = {
    getPersonById, findPersonBySurname, addFolderId, addPerson, findShortcut, findByNip, getPersons, updatePerson
};
