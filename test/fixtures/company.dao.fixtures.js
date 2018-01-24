const companies = [{
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
}, {
    addressId: null,
    id: 2,
    name: 'Firma Testowa',
    nip: '1029456789',
    regon: null,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '908070',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'FIRMTEST'
}, {
    addressId: 2,
    id: 3,
    name: 'Firma badfghjklrtek',
    nip: '176543330',
    regon: 55343367,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '1234567890',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'TEST'
}];
const findCompany = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
};

const afterRegisterCompany = [
    {
        addressId: 1,
        id: 1,
        name: 'Kuba',
        nip: '1029384756',
        regon: 243124,
        googleCompanyId: null,
        bankAccounts: {
            '0': {
                editMode: false,
                account: '56657567567567',
                name: 'PLN',
                bankName: 'BANK MILLENNIUM S.A.',
                swift: 'BIGBPLPW'
            }
        },
        shortcut: 'KUBA'
    },
    {
        addressId: null,
        id: 2,
        name: 'Firma Testowa',
        nip: '1029456789',
        regon: null,
        googleCompanyId: null,
        bankAccounts: {
            '0': {
                editMode: false,
                account: '908070',
                name: 'PLN',
                bankName: 'BANK MILLENNIUM S.A.',
                swift: 'BIGBPLPW'
            }
        },
        shortcut: 'FIRMTEST'
    },
    {
        id: 3,
        name: 'Firma test',
        nip: '7890123456',
        regon: null,
        addressId: null,
        googleCompanyId: null,
        bankAccounts: null,
        shortcut: 'TEST'
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
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'

};

const updateAddress = {
    addressId: 2,
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
};

const afterAddFolderId = {
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    addressId: 1,
    googleCompanyId: 'sdfhshf',
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
};

const getCompanyDetails = {
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    street: 'polska',
    buildNr: '8',
    flatNr: '8',
    postCode: '33-100',
    city: 'tutaj',
    shortcut: 'KUBA'

};

const updateAccount = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '566575675675999',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
};

const updateCompany = {
    addressId: 1,
    id: 1,
    name: 'Kuba',
    nip: '1029384756',
    regon: 243124,
    googleCompanyId: null,
    bankAccounts: {
        '0': {
            editMode: false,
            account: '56657567567567',
            name: 'PLN',
            bankName: 'BANK MILLENNIUM S.A.',
            swift: 'BIGBPLPW'
        }
    },
    shortcut: 'KUBA'
};


module.exports = {
    companies, findCompany, nothing, address, afterRegisterCompany, updateAddress, afterAddFolderId, getCompanyDetails, updateAccount, updateCompany
};

