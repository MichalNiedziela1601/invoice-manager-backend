'use strict';

const personDAO = require('../dao/person.dao');
const addressDAO = require('../dao/address.dao');
const appException = require('../services/applicationException');
const Promise = require('bluebird');
const applicationException = require('../services/applicationException');

function findPersonBySurname(lastName)
{
    return personDAO.findPersonBySurname(lastName);
}

function getPersonById(id)
{
    let personDetails = {};
    return personDAO.getPersonById(id).then(person =>
    {
        personDetails = person;
        return addressDAO.getAddressById(person.addressId);
    }).then(address =>
    {
        personDetails.address = address;
        return personDetails;
    })
}

function addPerson(person)
{
    return addressDAO.addAddress(person.address).then(id =>
    {
        person.addressId = id;
        return personDAO.addPerson(person);
    }).catch(error =>
    {
        throw appException.new(appException.ERROR, error);
    })
}

function findShortcut(filter)
{
    return personDAO.findShortcut(filter);
}

function findByNip(nip)
{
    return personDAO.findByNip(nip);
}

function getPersons()
{
    return personDAO.getPersons().then(result =>
    {
        return Promise.map(result, function (person)
        {
            return addressDAO.getAddressById(person.addressId).then(address =>
            {
                person.address = address;
                return person;
            })
        })
    })
            .catch(error =>
            {
                throw applicationException.new(applicationException.NOT_FOUND, error)
            });
}

function updatePerson(person)
{
    return personDAO.updatePerson(person).then(() => {
        return addressDAO.updateAddress(person.address, person.addressId);
    })
}

module.exports = {
    findPersonBySurname, getPersonById, addPerson, findShortcut, findByNip, getPersons, updatePerson
};
