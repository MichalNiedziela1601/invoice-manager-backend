'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
function getAddressById(id){
    return db.one('SELECT * FROM address WHERE id = $1', [id]).then(address => parser.parseObj(address));
}

module.exports = {
    getAddressById
};
