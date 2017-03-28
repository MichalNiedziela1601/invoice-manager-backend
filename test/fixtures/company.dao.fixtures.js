const companies = [{
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
}, {
    addressId: 1,
    id: 2,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    regon: 55343367,
}];
const findCompany = {
    address_id: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
};

const address = [{
    street: 'polska',
    buildNr: 8,
    flatNr: 8,
    postCode: '33-100',
    city: 'tutaj'
}, {
    street: 'andrzje',
    buildNr: 9,
    flatNr: 6,
    postCode: '33-100',
    city: 'tuaj'
}];
const nothing = [];

module.exports = {
    companies, findCompany, nothing, address
};

