'use strict';

const personDAO = require('../dao/person.dao');
const addressDAO = require('../dao/address.dao');

function findPersonBySurname(lastName){
    return personDAO.findPersonBySurname(lastName);
}

function getPersonById(id)
{
    let personDetails = {};
    return personDAO.getPersonById(id).then(person => {
        personDetails = person;
        return addressDAO.getAddressById(person.addressId);
    }).then(address => {
        personDetails.address = address;
        return personDetails;
    })
}

module.exports = {
    findPersonBySurname, getPersonById
};
