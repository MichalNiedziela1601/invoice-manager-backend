'use strict';
const db = require('../services/db.connect');

function getAll()
{
    let sql = 'SELECT * FROM contractor';
    return db.any(sql).then(result =>
    {
        return result;
    })
}

module.exports = {
    getAll
};
