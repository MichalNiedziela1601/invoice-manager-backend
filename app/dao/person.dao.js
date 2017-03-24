'use strict';
const db = require('../services/db.connect');

function getPersonById(id){
    return db.one('SELECT * FROM person WHERE id = $1',[id]);
}

module.exports = {
    getPersonById
};
