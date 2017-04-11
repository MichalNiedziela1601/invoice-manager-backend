const companies = [{
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null
}, {
    addressId: null,
    id: 2,
    name: 'Firma Testowa',
    nip: 1029456789,
    regon: null,
    googleCompanyId: null
}, {
    addressId: 2,
    id: 3,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    regon: 55343367,
    googleCompanyId: null
}];
const findCompany = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null
};

const afterRegisterCompany = [
    {
        addressId: 1,
        id: 1,
        name: 'Kuba',
        nip: 1029384756,
        regon: 243124,
        googleCompanyId: null
    },
    {
        addressId: null,
        id: 2,
        name: 'Firma Testowa',
        nip: 1029456789,
        regon: null,
        googleCompanyId: null
    },
    {
        id: 3,
        name: 'Firma test',
        nip: 7890123456,
        regon: null,
        addressId: null,
        googleCompanyId: null
    }
];

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
const nothing = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null

};

module.exports = {
    companies, findCompany, nothing, address, afterRegisterCompany
};

