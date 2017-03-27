const companies = [{
    addressId: 1, buildNr: '8', city: 'tutaj', flatNr: '8', id: 1, name: 'Kuba', nip: 1029384756, postCode: '33-100', regon: 243124, street: 'polska'
}, {
    addressId: 1,
    buildNr: '8',
    city: 'tutaj',
    flatNr: '8',
    id: 2,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    postCode: '33-100',
    regon: 55343367,
    street: 'polska'
}];
const findCompany = {
    address_id: 1, id: 1, name: 'Kuba', nip: 1029384756, regon: 243124,
};

const address = [{
    street: 'polska', buildNr: 8, flatNr: 8, postCode: '33-100', city: 'tutaj'
}, {
    street: 'andrzje', buildNr: 9, flatNr: 6, postCode: '33-100', city: 'tuaj'
}];
const nothing = [];

module.exports = {
    companies, findCompany, nothing, address
};

