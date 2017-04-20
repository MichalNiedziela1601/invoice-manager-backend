'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getPersonById(id)
{
    return db.one('SELECT * FROM person WHERE id = $1', [id]).then(person => parser.parseObj(person));
}

module.exports = {
    getPersonById
};
