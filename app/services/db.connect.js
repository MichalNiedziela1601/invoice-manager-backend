'use strict';
const promise = require('bluebird');
const options = {
    promiseLib: promise
};

let pgp = require('pg-promise')(options);

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
