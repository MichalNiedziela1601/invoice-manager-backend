const addresses = [
    {
        id: 1,
        street: 'Spokojna',
        buildNr: '4',
        flatNr: '5',
        postCode: '33-100',
        city: 'Tarnów',
        country: 'Poland',
        countryCode: 'PL',
        state: null
    }, {
        id: 2,
        street: 'Krakowska',
        buildNr: '4',
        flatNr: null,
        postCode: '33-100',
        city: 'Tarnów',
        country: 'Poland',
        countryCode: 'PL',
        state: null
    }
];

const updateAddress = [
    {
        id: 1,
        street: 'Tuchowska',
        buildNr: '4',
        flatNr: '5',
        postCode: '33-100',
        city: 'Tarnów',
        country: 'Poland',
        countryCode: 'PL',
        state: null
    }
];

const addressAdd = {
    street: 'bla',
    buildNr: '5',
    flatNr: '5a',
    postCode: '4498gg',
    city: 'Where',
    id: 3,
    country: 'Poland',
    countryCode: 'PL',
    state: null
};

module.exports = {
    addresses, updateAddress, addressAdd
}
