'use strict';
const db = require('../services/db.connect');
function getAddressById(id){
    return db.one('SELECT * FROM address WHERE id = $1', [id]);
}

module.exports = {
    getAddressById
}
