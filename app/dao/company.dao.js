'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');

function getCompanies()
{
    let sql = 'SELECT * FROM company LEFT JOIN address ON company.address_id = address.id';
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);
    }).catch(error =>
    {
        console.error('ERROR company.dao.getCompanies:', error.message || error);
        throw error;
    });
}
function addCompany(company)
{
    let sql = 'INSERT INTO company (name,nip, regon, address_id) VALUES ($1,$2,$3,$4)';
    return db.any(sql, [company.name, company.nip, company.regon, company.addressId]).catch(error =>
    {
        console.error('ERROR company.dao.addCompany:', error.message || error);
        throw error;
    });
}
function addAddress(address)
{
    let sql = 'INSERT INTO address (street, build_nr, flat_nr, post_code, city) VALUES ($1,$2,$3,$4,$5) RETURNING id;';
    return db.any(sql, [address.street, address.buildNr, address.flatNr, address.postCode, address.city]).then(result =>
    {
        return result[0].id;
    }).catch(error =>
    {
        console.error('ERROR company.dao.addAddress:', error.message || error);
        throw error;
    });
}
function findCompanyByNip(nip)
{
    let query = 'SELECT c.id,c.name,c.nip, c.regon, a.street, a.build_nr, a.flat_nr, a.post_code, a.city '
            + 'FROM company AS c LEFT JOIN address AS a ON c.address_id = a.id WHERE c.nip = $1';
    return db.one(query, [nip]).then(result =>
    {
        return parser.parseObj(result);
    }).catch(error =>
    {
        console.error('ERROR company.dao.findCopmanyByNip:', error.message || error);
        throw error;
    })
}

function checkNip(nip)
{
    return db.oneOrNone('SELECT nip FROM company WHERE nip = $1', [nip]).then(result =>
    {
        return result;
    }).catch(error =>
    {
        console.error('ERROR checkNip:', error.message || error);
        throw error;
    })
}

module.exports = {
    getCompanies, addCompany, addAddress, findCompanyByNip, checkNip
};
