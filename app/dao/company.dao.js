'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');

function getCompanies()
{
    let sql = 'SELECT * FROM company';
    return db.any(sql).then(result =>
    {
        return parser.parseArrayOfObject(result);
    });
}
function addCompany(company)
{
    company.shortcut = company.shortcut.toUpperCase();
    let sql = 'INSERT INTO company (name,nip, regon, address_id, bank_account,bank_name, shortcut) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    return db.none(sql, [company.name, company.nip, company.regon, company.addressId, company.bankAccount, company.bankName, company.shortcut]).catch(error =>
    {
        throw applicationException.new(applicationException.ERROR, error);
    });
}
function addCompanyRegister(person)
{
    let company = 'INSERT INTO company (name,nip,shortcut) values($1,$2,$3) returning id';
    return db.one(company, [person.name, person.nip, person.shortcut]).then(data =>
    {
        return data.id
    }).catch(error =>
    {
        throw applicationException.new(applicationException.PRECONDITION_FAILED, error);
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
        throw applicationException.new(applicationException.PRECONDITION_FAILED, error);
    });
}
function getCompanyDetails(nip)
{
    let query = 'SELECT c.id,c.name,c.nip, c.regon, c.shortcut, a.street, a.build_nr, a.flat_nr, a.post_code, a.city '
            + 'FROM company AS c LEFT JOIN address AS a ON c.address_id = a.id WHERE c.nip = $1';
    return db.one(query, [nip]).then(result =>
    {
        return parser.parseObj(result);
    }).catch(() =>
    {
        throw applicationException.new(applicationException.NOT_FOUND, 'Company not found');
    })
}

function getCompanyByNip(nip)
{
    return db.one('SELECT * FROM company WHERE nip = $1', [nip]).then(result =>
    {
        return parser.parseObj(result);
    }).catch(() =>
    {
        throw applicationException.new(applicationException.NOT_FOUND, 'Company not found');
    });
}

function getNips(nip)
{
    nip = nip.toString().toUpperCase();
    return db.any('SELECT nip,name FROM company WHERE nip::text like \'%$1#%\' OR shortcut::text like \'%$1#%\'', [nip]).then(companies =>
    {
        return parser.parseArrayOfObject(companies);
    });
}

function updateCompanyAddress(addressId, companyId)
{
    return db.none('UPDATE company SET address_id=$1 WHERE id=$2;', [addressId, companyId]);
}
function getCompanyById(id)
{
    return db.one('SELECT * FROM company WHERE id = $1', [id]).then(company => parser.parseObj(company))
            .catch(() =>
            {

                throw applicationException.new(applicationException.NOT_FOUND, 'Company not found');
            });
}

function addFolderId(folderId, nip)
{
    return db.none('UPDATE company SET google_company_id = $1 WHERE nip = $2', [folderId, nip]).then(() =>
    {
        return folderId;
    });
}

function updateAccount(account, companyId)
{
    return db.none('UPDATE company SET bank_name = $1, bank_account = $2, swift = $3 WHERE id = $4',
            [account.bankName, account.bankAccount, account.swift, companyId])
}

function findShortcut(filter)
{
    return db.any('SELECT id FROM company WHERE shortcut = $1', [filter.shortcut.toUpperCase()]);
}

function updateCompany(company)
{
    return db.none('UPDATE company SET name = $1, shortcut = $2, nip = $3, regon = $4, bank_name = $5, bank_account = $6 WHERE id = $7',
            [company.name, company.shortcut, company.nip, company.regon, company.bankName, company.bankAccount, company.id]);
}

module.exports = {
    getCompanies,
    addCompany,
    addAddress,
    getCompanyDetails,
    getCompanyByNip,
    addCompanyRegister,
    getCompanyById,
    getNips,
    updateCompanyAddress,
    addFolderId,
    updateAccount,
    findShortcut,
    updateCompany
};
