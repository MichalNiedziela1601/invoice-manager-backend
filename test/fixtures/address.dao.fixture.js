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

module.exports = {
    addresses, updateAddress
}
