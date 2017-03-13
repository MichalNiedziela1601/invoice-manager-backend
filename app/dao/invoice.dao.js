'use strict';
const db = require('../services/db.connect');

function getInvoice()
{
    let sql = 'SELECT * FROM invoice';
    return db.any(sql).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}

module.exports = {
    getInvoice
};
