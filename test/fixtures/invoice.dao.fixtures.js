const invoices = [
    {
        id: 1,
        invoiceNr: 'FV/12/02/02',
        type: 'Buy',
        createDate: new Date('2012-02-07T23:00:00.000Z'),
        executionEndDate: new Date('2012-02-14T23:00:00.000Z'),
        nettoValue: '$230.45',
        bruttoValue: '$345.89',
        status: 'unpaid',
        url: 'url1',
        companyDealer: '1',
        companyRecipent: '2',
        personDealer: null,
        personRecipent: null
    },
    {
        id: 2,
        invoiceNr: 'FV/12/04/02',
        type: 'Sale',
        createDate: new Date('2012-04-07T22:00:00.000Z'),
        executionEndDate: new Date('2012-04-14T22:00:00.000Z'),
        nettoValue: '$330.45',
        bruttoValue: '$475.89',
        status: 'paid',
        url: 'url2',
        companyDealer: '2',
        companyRecipent: '1',
        personDealer: null,
        personRecipent: null
    },
    {
        id: 3,
        invoiceNr: 'FV/14/05/123',
        type: 'Sale',
        createDate: new Date('2014-05-17T22:00:00.000Z'),
        executionEndDate: new Date('2014-05-22T22:00:00.000Z'),
        nettoValue: '$2,230.45',
        bruttoValue: '$2,845.89',
        status: 'paid',
        url: 'url5',
        companyDealer: null,
        companyRecipent: null,
        personDealer: '2',
        personRecipent: '1'
    }
];

module.exports = {
    invoices
};

