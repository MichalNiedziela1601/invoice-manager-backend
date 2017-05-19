'use strict';
const person = {
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
    nip: 1234527890,
    addressId: 1,
    shortcut: 'KOWALJAN_KRK',
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
    bankAccount: null,
    swift: null,
    googlePersonId: 'wrwewq34w4'
};

module.exports = {
    person, personAfterAddFolder
};
