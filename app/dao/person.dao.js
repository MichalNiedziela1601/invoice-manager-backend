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
    return db.any('SELECT id, first_name,last_name FROM person WHERE last_name like \'%$1#%\'', [ lastName])
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


module.exports = {
    getPersonById,findPersonBySurname, addFolderId
};
