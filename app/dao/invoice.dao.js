'use strict';
const db = require('../services/db.connect');

function getInvoice()
{
    let sql = 'SELECT * FROM invoice';
    return db.any(sql).then(result =>
    {
        return result;
    })
}

module.exports = {
    getInvoice
};
