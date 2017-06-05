'use strict';
const person = {
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
    nip: 1234527890,
    addressId: 1,
    shortcut: 'KOWALJAN_KRK',
    bankName: null,
    bankAccount: null,
    swift: null,
    googlePersonId: null
};

const personAfterAddFolder = {
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
    nip: 1234527890,
    addressId: 1,
    shortcut: 'KOWALJAN_KRK',
    bankName: null,
    bankAccount: null,
    swift: null,
    googlePersonId: 'wrwewq34w4'
};

const personAdd = {
    id: 3,
    firstName: 'John',
    lastName: 'Smith',
    shortcut: 'SMITHJOHN',
    nip: null,
    bankName: 'BANK',
    bankAccount: '9878979879454545',
    addressId: 1,
    googlePersonId: null,
    swift: null
};

const getPersons = [
    {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        nip: 1234527890,
        addressId: 1,
        shortcut: 'KOWALJAN_KRK',
        bankName: null,
        bankAccount: null,
        swift: null,
        googlePersonId: null
    },

    {
        id: 2,
        firstName: 'Marian',
        lastName: 'Zalewski',
        nip: null,
        addressId: 2,
        shortcut: 'ZALEWMARIAN_CITY1',
        bankName: null,
        bankAccount: null,
        swift: null,
        googlePersonId: null
    }
];

const updatePerson = {
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
    nip: 1234527890,
    addressId: 1,
    shortcut: 'KOWALJAN_KRK',
    bankName: 'BANK',
    bankAccount: null,
    swift: null,
    googlePersonId: null
}

module.exports = {
    person, personAfterAddFolder, personAdd, getPersons, updatePerson
};
