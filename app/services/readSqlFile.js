'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const readFile = Promise.promisify(fs.readFile, fs);

function executeSqlFromFile(path)
{
    return readFile(path, {encoding: 'UTF-8'}).then(file =>
    {
        return file;
    });
}

module.exports = executeSqlFromFile;
