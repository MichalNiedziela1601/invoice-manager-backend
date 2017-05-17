const companies = [{
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407',
    bankName: 'Alior Bank',
    swift: null
}, {
    addressId: null,
    id: 2,
    name: 'Firma Testowa',
    nip: 1029456789,
    regon: null,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853408',
    bankName: 'ING',
    swift: null
}, {
    addressId: 2,
    id: 3,
    name: 'Firma badfghjklrtek',
    nip: 176543330,
    regon: 55343367,
    googleCompanyId: null,
    bankName: null,
    bankAccount: null,
    swift: null
}];
const findCompany = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407',
    bankName: 'Alior Bank',
    swift: null
};

const afterRegisterCompany = [
    {
        addressId: 1,
        id: 1,
        name: 'Kuba',
        nip: 1029384756,
        regon: 243124,
        googleCompanyId: null,
        bankAccount: '22068903623586048228853407',
        bankName: 'Alior Bank',
        swift: null
    },
    {
        addressId: null,
        id: 2,
        name: 'Firma Testowa',
        nip: 1029456789,
        regon: null,
        googleCompanyId: null,
        bankAccount: '22068903623586048228853408',
        bankName: 'ING',
        swift: null
    },
    {
        id: 3,
        name: 'Firma test',
        nip: 7890123456,
        regon: null,
        addressId: null,
        googleCompanyId: null,
        bankAccount: null,
        bankName: null,
        swift: null
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
    bankAccount: '22068903623586048228853407',
    bankName: 'Alior Bank',
    swift: null

};

const updateAddress = {
    addressId: 2,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '22068903623586048228853407',
    bankName: 'Alior Bank',
    swift: null
};

const afterAddFolderId = {
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    addressId: 1,
    googleCompanyId: 'sdfhshf',
    bankAccount: '22068903623586048228853407',
    bankName: 'Alior Bank',
    swift: null
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

const updateAccount = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: 1029384756,
    regon: 243124,
    googleCompanyId: null,
    bankAccount: '98789768768768768',
    bankName: 'MBANK',
    swift: 'MBPLNG'
};


module.exports = {
    companies, findCompany, nothing, address, afterRegisterCompany, updateAddress, afterAddFolderId, getCompanyDetails, updateAccount
};

