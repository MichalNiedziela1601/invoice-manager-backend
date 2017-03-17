'use strict';
const _ = require('lodash');
const db = require('../app/services/db.connect');
const Promise = require('bluebird');
const fs = require('fs');
const readFile = Promise.promisify(fs.readFile, fs);

let collection = ['users', 'invoice', 'company', 'person', 'address'];
let sequences = ['invoice_id_seq', 'users_id_seq', 'company_id_seq', 'person_id_seq', 'address_id_seq'];

function clearCollections(tables)
{
    return _.map(tables, function (table)
    {
        return 'DELETE FROM ' + table + ';'
    }).join('');
}

function clearSequence(seqs)
{
    return _.map(seqs, function (seq)
    {
        return 'SELECT setval(\'' + seq + '\', 100);'
    }).join('');
}

function clearDB()
{
    return db.any(clearCollections(collection) + clearSequence(sequences));
}

function seed(path)
{
    return readFile(path, {encoding: 'UTF-8'}).then(function (query)
    {
        return db.any(query);
    });
}

module.exports = {
    clearDB,
    clearCollections,
    clearSequence,
    seed
};
