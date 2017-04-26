const companies = [{
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407'
}, {
    addressId: null,
    id: 2,
    name: 'Firma Testowa',
    nip: 1029456789,
    regon: null,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853408'
}, {
    addressId: 2,
    id: 3,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    regon: 55343367,
    googleCompanyId: null,
    bankAccount: null
}];
const findCompany = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407'
};

const afterRegisterCompany = [
    {
        addressId: 1,
        id: 1,
        name: 'Kuba',
        nip: 1029384756,
        regon: 243124,
        googleCompanyId: null,
        bankAccount: '22068903623586048228853407'
    },
    {
        addressId: null,
        id: 2,
        name: 'Firma Testowa',
        nip: 1029456789,
        regon: null,
        googleCompanyId: null,
        bankAccount: '22068903623586048228853408'
    },
    {
        id: 3,
        name: 'Firma test',
        nip: 7890123456,
        regon: null,
        addressId: null,
        googleCompanyId: null,
        bankAccount: null
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
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407'

};

const updateAddress = {
    addressId: 2,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407'
};

const afterAddFolderId = {
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    addressId: 1,
    googleCompanyId: 'sdfhshf',
    bankAccount: '22068903623586048228853407'
};

const getCompanyDetails = {
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    street: 'polska',
    buildNr: '8',
    flatNr: '8',
    postCode: '33-100',
    city: 'tutaj'
};


module.exports = {
    companies, findCompany, nothing, address, afterRegisterCompany, updateAddress, afterAddFolderId,getCompanyDetails
};

