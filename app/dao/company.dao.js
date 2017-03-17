'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getCompanies()
{
    let sql = 'SELECT * FROM company';
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);
    }).catch(error =>
    {
        console.log('ERROR:', error.message || error);
        return error;
    });
}
function addCompany(company)
{
    let sql = 'INSERT INTO company (name,nip, regon, email, address_id) VALUES ($1,$2,$3,$4,$5)';
    return db.any(sql, [company.name, company.nip, company.regon, company.email, company.address]);
}
function addAddress(address)
{
    let sql = 'INSERT INTO address (street, build_nr, flat_nr, post_code, city) VALUES ($1,$2,$3,$4,$5)';
    return db.any(sql, [address.street, address.build_nr, address.flat_nr, address.post_code, address.city]);
}
function findCompanyByNip(nip)
{
    let query = 'SELECT c.id,c.name,c.nip, c.regon, a.street, a.build_nr, a.flat_nr, a.post_code, a.city '
            + 'FROM company AS c LEFT JOIN address AS a ON c.address_id = a.id WHERE c.nip = $1';
    return db.oneOrNone(query, [nip]).then(result =>
    {
        if (result === null) {
            result = 'Company not found';
            return result;
        } else {
            return parser.parseObj(result);
        }
    }).catch(error => {
        console.log('ERROR:', error.message || error);
        return error;
    })
}

function checkNip(nip)
{
    return db.oneOrNone('SELECT nip FROM company WHERE nip = $1', [nip]).then(result =>
    {
        return result;
    }).catch(error =>
    {
        return error;
    })
}

module.exports = {
    getCompanies, addCompany, addAddress, findCompanyByNip, checkNip
};
