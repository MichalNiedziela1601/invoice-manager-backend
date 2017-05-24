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

module.exports = {
    getPersonById
};
