'use strict';
const promise = require('bluebird');
const options = {
    promiseLib: promise
};
const DATE_OID = 1082;

let pgp = require('pg-promise')(options);
pgp.pg.types.setTypeParser(20, function (value)
{
    return parseInt(value,10);
});
function time(val){
    return new Date(val);
}
pgp.pg.types.setTypeParser(DATE_OID,time);

let configFile = require('../config');
const config = {
    host: configFile.db.host,
    database: configFile.db.database,
    user: configFile.db.user,
    password: configFile.db.password,
    port: configFile.db.port
};

const db = pgp(config);

module.exports = db;
