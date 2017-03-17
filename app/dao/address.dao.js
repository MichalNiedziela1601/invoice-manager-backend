'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getAddress(id)
{
    let sql = 'SELECT * FROM address WHERE id = $1';
    return db.any(sql, [id]).then(result =>
    {
        return parser.parseArrayOfObject(result)[0];
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}

module.exports = {
    getAddress
};
