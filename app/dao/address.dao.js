'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');
function getAddressById(id)
{
    return db.one('SELECT * FROM address WHERE id = $1', [id]).then(address => parser.parseObj(address))
            .catch(() =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, 'Address not found');
            });
}

function updateAddress(address, addressId)
{
    return db.none(
            'UPDATE address SET street = $2, build_nr = $3, flat_nr = $4, post_code = $5, city = $6, country = $7, country_code = $8 WHERE id = $1',
            [addressId, address.street, address.buildNr, address.flatNr, address.postCode, address.city, address.country, address.countryCode]);
}

function addAddress(address)
{
    let sql = 'INSERT INTO address (street, build_nr, flat_nr, post_code, city, country, country_code) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id;';
    return db.any(sql, [address.street, address.buildNr, address.flatNr, address.postCode, address.city, address.country, address.countryCode])
            .then(result =>
            {
                return result[0].id;
            })
            .catch(error =>
            {
                throw applicationException.new(applicationException.PRECONDITION_FAILED, error);
            });
}

module.exports = {
    getAddressById, updateAddress, addAddress
};
