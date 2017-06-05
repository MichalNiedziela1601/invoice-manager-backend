const addresses = [
    {
        id: 1,
        street: 'Spokojna',
        buildNr: '4',
        flatNr: '5',
        postCode: '33-100',
        city: 'Tarnów'
    }, {
        id: 2,
        street: 'Krakowska',
        buildNr: '4',
        flatNr: null,
        postCode: '33-100',
        city: 'Tarnów'
    }
];

const updateAddress = [
    {
        id: 1,
        street: 'Tuchowska',
        buildNr: '4',
        flatNr: '5',
        postCode: '33-100',
        city: 'Tarnów'
    }
];

const addressAdd = {
    street: 'bla',
    buildNr: '5',
    flatNr: '5a',
    postCode: '4498gg',
    city: 'Where',
    id: 3
};

module.exports = {
    addresses, updateAddress, addressAdd
}
