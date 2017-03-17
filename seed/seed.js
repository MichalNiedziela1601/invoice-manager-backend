'use strict';
const db = require('./../app/services/db.connect.js');
const Promise = require('bluebird');
const fs = require('fs');
const readFile = Promise.promisify(fs.readFile, fs);
const fileNames = ['seed/sql/schema.down.sql', 'seed/sql/schema.up.sql', 'seed/sql/seed.sql'];


function executeSqlQuery(sql)
{
    return db.any(sql).then(() =>
    {

    })
}

function executeSqlFromFile(path)
{
    return readFile(path, {encoding: 'UTF-8'}).then(executeSqlQuery);
}

Promise.reduce(fileNames, function (total, fileName)
{
    return executeSqlFromFile(fileName)
}, 0).then(() =>
{
    console.log('Seeding script success ');
    process.exit(0);
}).catch(error =>
{
    console.error(error);
    process.exit(1);
});
