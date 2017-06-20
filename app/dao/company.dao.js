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
    let sql = 'INSERT INTO company (name,nip, regon, address_id, bank_accounts,shortcut) VALUES ($1,$2,$3,$4,$5,$6) returning id';
    return db.one(sql, [company.name, company.nip, company.regon, company.addressId, company.bankAccounts, company.shortcut]).catch(error =>
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
    return db.none('UPDATE company SET bank_accounts = $1 WHERE id = $2',
            [account, companyId])
}

function findShortcut(filter)
{
    return db.any('SELECT id FROM company WHERE shortcut = $1', [filter.shortcut.toUpperCase()]);
}

function updateCompany(company)
{
    return db.none('UPDATE company SET name = $1, shortcut = $2, nip = $3, regon = $4, bank_accounts = $5 WHERE id = $6',
            [company.name, company.shortcut, company.nip, company.regon, company.bankAccounts, company.id]);
}

module.exports = {
    getCompanies,
    addCompany,
    getCompanyByNip,
    addCompanyRegister,
    getCompanyById,
    updateCompanyAddress,
    addFolderId,
    updateAccount,
    findShortcut,
    updateCompany
};
