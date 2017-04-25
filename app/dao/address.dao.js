'use strict';
const db = require('../services/db.connect');
const parser = require('../services/camelCaseParser');
const applicationException = require('../services/applicationException');
function getAddressById(id)
{
    return db.one('SELECT * FROM address WHERE id = $1', [id]).then(address => parser.parseObj(address))
            .catch(() => {
                throw applicationException.new(applicationException.NOT_FOUND,'Address not found');
            });
}

function updateAddress(address, addressId)
{
    return db.none('UPDATE address SET street = $1, build_nr = $2, flat_nr = $3, post_code = $4, city = $5 WHERE id = $6',
            [address.street, address.buildNr, address.flatNr, address.postCode, address.city, addressId]);
}

module.exports = {
    getAddressById, updateAddress
};
