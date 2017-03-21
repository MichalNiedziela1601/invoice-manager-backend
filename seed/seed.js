'use strict';
const db = require('./../app/services/db.connect.js');
const Promise = require('bluebird');
const fileNames = ['seed/sql/schema.down.sql', 'seed/sql/schema.up.sql', 'seed/sql/seed.sql'];
const readSqlFile = require('../app/services/readSqlFile');

function executeSqlQuery(sql)
{
    return db.any(sql);
}


Promise.reduce(fileNames, function (total, fileName)
{
    return readSqlFile(fileName).then(executeSqlQuery);
}, 0).then(() =>
{
    console.log('Seeding script success ');
    process.exit(0);
}).catch(error =>
{
    console.error(error);
    process.exit(1);
});
