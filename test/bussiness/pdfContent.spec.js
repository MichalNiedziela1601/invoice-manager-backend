'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);
const applicationException = require('../../app/services/applicationException');
const _ = require('lodash');

const expect = chai.expect;

const personManagerMock = {
    getPersonById: sinon.stub()
};

const companyManager = {
    getCompanyById: sinon.stub()
};

const pdfContenet = proxyquire('../../app/business/pdfContent', {
    './company.manager.js': companyManager,
    './person.manager.js': personManagerMock
});

const invoice = {
    products: {
        '0': {
            editMode: false,
            amount: 1,
            unit: 'unit',
            name: 'IT service',
            netto: 5000,
            brutto: 5000
        }
    },
    status: 'unpaid',
    reverseCharge: true,
    showAmount: true,
    paymentMethod: 'bank transfer',
    invoiceNr: 'FV 2017/6/1',
    contractorType: 'company',
    recipentAccountNr: null,
    nettoValue: 5000,
    bruttoValue: 5000,
    language: 'en',
    currency: 'USD',
    dealerAccountNr: '0',
    description: 'sdfsdfsdf',
    type: 'sell',
    companyDealer: 2,
    companyRecipent: 1,
    createDate: '2017-06-16',
    executionEndDate: '2017-06-16',
    year: 2017,
    month: 6,
    number: 1

};

let result = {};
describe('pdfContent', function ()
{
    describe('when contractorType is company', function ()
    {
        describe('when reverse charge true', function ()
        {
            describe('when showAmount true', function ()
            {
                describe('when paymentMethod bank transfer and language: en', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    nip: '1234567890',
                                    address: {
                                        street: 'Test',
                                        buildNr: '5',
                                        flatNr: '9',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'PL'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    nip: '1234567891',
                                    address: {
                                        street: 'Test1',
                                        buildNr: '5',
                                        flatNr: '3',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'UK'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should call twice getCompanyById', function ()
                    {
                        expect(companyManager.getCompanyById).callCount(2);
                        expect(companyManager.getCompanyById).calledWith(1);
                        expect(companyManager.getCompanyById).calledWith(2);

                    });
                    it('should set seller information', function ()
                    {
                        expect(result.content[0].columns[0].text[0].text).eql('Firma TEST2\n');
                        expect(result.content[0].columns[0].text[1].text).eql('Test1 5/3\n');
                        expect(result.content[0].columns[0].text[2].text).eql('44-596 Tarnów\n');
                        expect(result.content[0].columns[0].text[3].text).eql('NIP: 1234567891\n');
                    });
                    it('should set createDate, payDate, issuePlace', function ()
                    {
                        expect(result.content[0].columns[1].table.body[1][0].text).eql('Tarnów');
                        expect(result.content[0].columns[1].table.body[3][0].text).eql('2017-06-16');
                        expect(result.content[0].columns[1].table.body[5][0].text).eql('2017-06-16');
                    });
                    it('should layout return 0;', function ()
                    {
                        expect(result.content[0].columns[1].layout.vLineWidth()).eql(0);
                    });
                    it('should set seller section', function ()
                    {
                        expect(result.content[1].columns[0].table.body[1][0].text, 'seller name').eql('Name: Firma TEST2');
                        expect(result.content[1].columns[0].table.body[2][0].text, 'seller address').eql('Test1 5/3');
                        expect(result.content[1].columns[0].table.body[3][0].text, 'seller postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[0].table.body[4][0].text[0].text, 'seller NIP').eql('NIP: ');
                        expect(result.content[1].columns[0].table.body[4][0].text[1].text, 'seller NIP - country code').eql('UK');
                        expect(result.content[1].columns[0].table.body[4][0].text[2].text, 'seller NIP - nip').eql('1234567891');
                    });
                    it('should set buyer section', function ()
                    {
                        expect(result.content[1].columns[1].table.body[1][0].text, 'buyer name').eql('Name: Firma TEST');
                        expect(result.content[1].columns[1].table.body[2][0].text, 'buyer address').eql('Test 5/9');
                        expect(result.content[1].columns[1].table.body[3][0].text, 'buyer postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[1].table.body[4][0].text[0].text, 'buyer NIP').eql('NIP: ');
                        expect(result.content[1].columns[1].table.body[4][0].text[1].text, 'buyer NIP - country code').eql('PL');
                        expect(result.content[1].columns[1].table.body[4][0].text[2].text, 'buyer NIP - nip').eql('1234567890');
                    });
                    it('should set title with invoiceNR', function ()
                    {
                        expect(result.content[2].text[0].text).eql('Invoice FV 2017/6/1');
                        expect(result.content[2].text[1].text).eql('\n(reverse charge)');
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2]).eql(1);
                        expect(result.content[3].table.body[1][3]).eql('unit');
                        expect(result.content[3].table.body[1][4].text).eql('5000.00');
                        expect(result.content[3].table.body[1][5].text).eql('5000.00');
                        expect(result.content[3].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[3].layout.fillColor(1)).eql(null);
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                    it('should set bank section', function ()
                    {
                        expect(result.content[5].columns[1].text[0]).eql('bank transfer\n');
                        expect(result.content[5].columns[1].text[1]).eql('2017-06-16\n');
                        expect(result.content[5].columns[1].text[2]).eql('345 784798375 384753495\n');
                        expect(result.content[5].columns[1].text[3]).eql('BIGBPLPW');
                    });
                    it('should set description', function ()
                    {
                        expect(result.content[6].text[1].text).eql('sdfsdfsdf');
                    });
                    it('should set summary section', function ()
                    {
                        expect(result.content[7].table.body[0][1].text).eql('5000.00 USD');
                        expect(result.content[7].table.body[1][0].text).eql('Advance: 0.00 USD');
                        expect(result.content[7].table.body[1][1].text).eql('Amount due: 5000.00 USD');
                        expect(result.content[7].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[7].layout.fillColor(1)).eql(null);

                    });
                });
                describe('when paymentMethod bank transfer and language: pl', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        invoiceMock.language = 'pl';
                        delete invoiceMock.description;
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    nip: '1234567890',
                                    address: {street: 'Test', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'PL'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    nip: '1234567891',
                                    address: {street: 'Test1', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'UK'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should call twice getCompanyById', function ()
                    {
                        expect(companyManager.getCompanyById).callCount(2);
                        expect(companyManager.getCompanyById).calledWith(1);
                        expect(companyManager.getCompanyById).calledWith(2);

                    });
                    it('should set seller information', function ()
                    {
                        expect(result.content[0].columns[0].text[0].text).eql('Firma TEST2\n');
                        expect(result.content[0].columns[0].text[1].text).eql('Test1 5\n');
                        expect(result.content[0].columns[0].text[2].text).eql('44-596 Tarnów\n');
                        expect(result.content[0].columns[0].text[3].text).eql('NIP: 1234567891\n');
                    });
                    it('should set createDate, payDate, issuePlace', function ()
                    {
                        expect(result.content[0].columns[1].table.body[1][0].text).eql('Tarnów');
                        expect(result.content[0].columns[1].table.body[3][0].text).eql('2017-06-16');
                        expect(result.content[0].columns[1].table.body[5][0].text).eql('2017-06-16');
                    });
                    it('should layout return 0;', function ()
                    {
                        expect(result.content[0].columns[1].layout.vLineWidth()).eql(0);
                    });
                    it('should set seller section', function ()
                    {
                        expect(result.content[1].columns[0].table.body[1][0].text, 'seller name').eql('Nazwa(name): Firma TEST2');
                        expect(result.content[1].columns[0].table.body[2][0].text, 'seller address').eql('Test1 5');
                        expect(result.content[1].columns[0].table.body[3][0].text, 'seller postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[0].table.body[4][0].text[0].text, 'seller NIP').eql('NIP: ');
                        expect(result.content[1].columns[0].table.body[4][0].text[1].text, 'seller NIP - country code').eql('UK');
                        expect(result.content[1].columns[0].table.body[4][0].text[2].text, 'seller NIP - nip').eql('1234567891');
                    });
                    it('should set buyer section', function ()
                    {
                        expect(result.content[1].columns[1].table.body[1][0].text, 'buyer name').eql('Nazwa(name): Firma TEST');
                        expect(result.content[1].columns[1].table.body[2][0].text, 'buyer address').eql('Test 5');
                        expect(result.content[1].columns[1].table.body[3][0].text, 'buyer postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[1].table.body[4][0].text[0].text, 'buyer NIP').eql('NIP: ');
                        expect(result.content[1].columns[1].table.body[4][0].text[1].text, 'buyer NIP - country code').eql('PL');
                        expect(result.content[1].columns[1].table.body[4][0].text[2].text, 'buyer NIP - nip').eql('1234567890');
                    });
                    it('should set title with invoiceNR', function ()
                    {
                        expect(result.content[2].text[0].text).eql('Faktura (Invoice) FV 2017/6/1');
                        expect(result.content[2].text[1].text).eql('\n(odwrotne obciążenie (reverse charge) )');
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2]).eql(1);
                        expect(result.content[3].table.body[1][3]).eql('unit');
                        expect(result.content[3].table.body[1][4].text).eql('5000.00');
                        expect(result.content[3].table.body[1][5].text).eql('5000.00');
                        expect(result.content[3].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[3].layout.fillColor(1)).eql(null);
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                    it('should set bank section', function ()
                    {
                        expect(result.content[5].columns[1].text[0]).eql('przelew(bank transfer)\n');
                        expect(result.content[5].columns[1].text[1]).eql('2017-06-16\n');
                        expect(result.content[5].columns[1].text[2]).eql('345 784798375 384753495\n');
                        expect(result.content[5].columns[1].text[3]).eql('BIGBPLPW');
                    });
                    it('should set summary section', function ()
                    {
                        expect(result.content[7].table.body[0][1].text).eql('5000.00 USD');
                        expect(result.content[7].table.body[1][0].text).eql('Zapłacono (advance): 0.00 USD');
                        expect(result.content[7].table.body[1][1].text).eql('Pozostało do zapłaty (amount due): 5000.00 USD');
                        expect(result.content[7].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[7].layout.fillColor(1)).eql(null);

                    });
                });

                describe('when paymentMethod cash and language: en', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        invoiceMock.paymentMethod = 'cash';
                        invoiceMock.language = 'pl';
                        invoiceMock.dealerAccountNr = null;
                        invoiceMock.products['0'].amount = null;
                        delete invoiceMock.description;
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    nip: '1234567890',
                                    address: {street: 'Test', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'PL'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    nip: '1234567891',
                                    address: {street: 'Test1', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'UK'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should call twice getCompanyById', function ()
                    {
                        expect(companyManager.getCompanyById).callCount(2);
                        expect(companyManager.getCompanyById).calledWith(1);
                        expect(companyManager.getCompanyById).calledWith(2);

                    });
                    it('should set seller information', function ()
                    {
                        expect(result.content[0].columns[0].text[0].text).eql('Firma TEST2\n');
                        expect(result.content[0].columns[0].text[1].text).eql('Test1 5\n');
                        expect(result.content[0].columns[0].text[2].text).eql('44-596 Tarnów\n');
                        expect(result.content[0].columns[0].text[3].text).eql('NIP: 1234567891\n');
                    });
                    it('should set createDate, payDate, issuePlace', function ()
                    {
                        expect(result.content[0].columns[1].table.body[1][0].text).eql('Tarnów');
                        expect(result.content[0].columns[1].table.body[3][0].text).eql('2017-06-16');
                        expect(result.content[0].columns[1].table.body[5][0].text).eql('2017-06-16');
                    });
                    it('should layout return 0;', function ()
                    {
                        expect(result.content[0].columns[1].layout.vLineWidth()).eql(0);
                    });
                    it('should set seller section', function ()
                    {
                        expect(result.content[1].columns[0].table.body[1][0].text, 'seller name').eql('Nazwa(name): Firma TEST2');
                        expect(result.content[1].columns[0].table.body[2][0].text, 'seller address').eql('Test1 5');
                        expect(result.content[1].columns[0].table.body[3][0].text, 'seller postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[0].table.body[4][0].text[0].text, 'seller NIP').eql('NIP: ');
                        expect(result.content[1].columns[0].table.body[4][0].text[1].text, 'seller NIP - country code').eql('UK');
                        expect(result.content[1].columns[0].table.body[4][0].text[2].text, 'seller NIP - nip').eql('1234567891');
                    });
                    it('should set buyer section', function ()
                    {
                        expect(result.content[1].columns[1].table.body[1][0].text, 'buyer name').eql('Nazwa(name): Firma TEST');
                        expect(result.content[1].columns[1].table.body[2][0].text, 'buyer address').eql('Test 5');
                        expect(result.content[1].columns[1].table.body[3][0].text, 'buyer postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[1].table.body[4][0].text[0].text, 'buyer NIP').eql('NIP: ');
                        expect(result.content[1].columns[1].table.body[4][0].text[1].text, 'buyer NIP - country code').eql('PL');
                        expect(result.content[1].columns[1].table.body[4][0].text[2].text, 'buyer NIP - nip').eql('1234567890');
                    });
                    it('should set title with invoiceNR', function ()
                    {
                        expect(result.content[2].text[0].text).eql('Faktura (Invoice) FV 2017/6/1');
                        expect(result.content[2].text[1].text).eql('\n(odwrotne obciążenie (reverse charge) )');
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2]).eql(null);
                        expect(result.content[3].table.body[1][3]).eql('unit');
                        expect(result.content[3].table.body[1][4].text).eql('5000.00');
                        expect(result.content[3].table.body[1][5].text).eql('5000.00');
                        expect(result.content[3].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[3].layout.fillColor(1)).eql(null);
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                    it('should set bank section', function ()
                    {
                        expect(result.content[5].columns[1].text[0]).eql('gotówka\n');
                        expect(result.content[5].columns[1].text[1]).eql('2017-06-16\n');
                        expect(result.content[5].columns[1].text[2]).eql('\n');
                        expect(result.content[5].columns[1].text[3]).eql('');
                    });
                    it('should set summary section', function ()
                    {
                        expect(result.content[7].table.body[0][1].text).eql('5000.00 USD');
                        expect(result.content[7].table.body[1][0].text).eql('Zapłacono (advance): 0.00 USD');
                        expect(result.content[7].table.body[1][1].text).eql('Pozostało do zapłaty (amount due): 5000.00 USD');
                        expect(result.content[7].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[7].layout.fillColor(1)).eql(null);
                    });
                });

                describe('when paymentMethod cash and language: pl', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        invoiceMock.paymentMethod = 'cash';
                        invoiceMock.dealerAccountNr = null;
                        delete invoiceMock.description;
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    nip: '1234567890',
                                    address: {street: 'Test', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'PL'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    nip: '1234567891',
                                    address: {street: 'Test1', buildNr: '5', postCode: '44-596', city: 'Tarnów', country: 'Polska', countryCode: 'UK'},
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should call twice getCompanyById', function ()
                    {
                        expect(companyManager.getCompanyById).callCount(2);
                        expect(companyManager.getCompanyById).calledWith(1);
                        expect(companyManager.getCompanyById).calledWith(2);

                    });
                    it('should set seller information', function ()
                    {
                        expect(result.content[0].columns[0].text[0].text).eql('Firma TEST2\n');
                        expect(result.content[0].columns[0].text[1].text).eql('Test1 5\n');
                        expect(result.content[0].columns[0].text[2].text).eql('44-596 Tarnów\n');
                        expect(result.content[0].columns[0].text[3].text).eql('NIP: 1234567891\n');
                    });
                    it('should set createDate, payDate, issuePlace', function ()
                    {
                        expect(result.content[0].columns[1].table.body[1][0].text).eql('Tarnów');
                        expect(result.content[0].columns[1].table.body[3][0].text).eql('2017-06-16');
                        expect(result.content[0].columns[1].table.body[5][0].text).eql('2017-06-16');
                    });
                    it('should layout return 0;', function ()
                    {
                        expect(result.content[0].columns[1].layout.vLineWidth()).eql(0);
                    });
                    it('should set seller section', function ()
                    {
                        expect(result.content[1].columns[0].table.body[1][0].text, 'seller name').eql('Name: Firma TEST2');
                        expect(result.content[1].columns[0].table.body[2][0].text, 'seller address').eql('Test1 5');
                        expect(result.content[1].columns[0].table.body[3][0].text, 'seller postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[0].table.body[4][0].text[0].text, 'seller NIP').eql('NIP: ');
                        expect(result.content[1].columns[0].table.body[4][0].text[1].text, 'seller NIP - country code').eql('UK');
                        expect(result.content[1].columns[0].table.body[4][0].text[2].text, 'seller NIP - nip').eql('1234567891');
                    });
                    it('should set buyer section', function ()
                    {
                        expect(result.content[1].columns[1].table.body[1][0].text, 'buyer name').eql('Name: Firma TEST');
                        expect(result.content[1].columns[1].table.body[2][0].text, 'buyer address').eql('Test 5');
                        expect(result.content[1].columns[1].table.body[3][0].text, 'buyer postcode').eql('44-596 Tarnów');
                        expect(result.content[1].columns[1].table.body[4][0].text[0].text, 'buyer NIP').eql('NIP: ');
                        expect(result.content[1].columns[1].table.body[4][0].text[1].text, 'buyer NIP - country code').eql('PL');
                        expect(result.content[1].columns[1].table.body[4][0].text[2].text, 'buyer NIP - nip').eql('1234567890');
                    });
                    it('should set title with invoiceNR', function ()
                    {
                        expect(result.content[2].text[0].text).eql('Invoice FV 2017/6/1');
                        expect(result.content[2].text[1].text).eql('\n(reverse charge)');
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2]).eql(1);
                        expect(result.content[3].table.body[1][3]).eql('unit');
                        expect(result.content[3].table.body[1][4].text).eql('5000.00');
                        expect(result.content[3].table.body[1][5].text).eql('5000.00');
                        expect(result.content[3].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[3].layout.fillColor(1)).eql(null);
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                    it('should set bank section', function ()
                    {
                        expect(result.content[5].columns[1].text[0]).eql('cash\n');
                        expect(result.content[5].columns[1].text[1]).eql('2017-06-16\n');
                        expect(result.content[5].columns[1].text[2]).eql('\n');
                        expect(result.content[5].columns[1].text[3]).eql('');
                    });
                    it('should set summary section', function ()
                    {
                        expect(result.content[7].table.body[0][1].text).eql('5000.00 USD');
                        expect(result.content[7].table.body[1][0].text).eql('Advance: 0.00 USD');
                        expect(result.content[7].table.body[1][1].text).eql('Amount due: 5000.00 USD');
                        expect(result.content[7].layout.fillColor(0)).eql('#CCCCCC');
                        expect(result.content[7].layout.fillColor(1)).eql(null);
                    });
                });
            });

            describe('when show ammount false', function ()
            {
                describe('when language en', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        invoiceMock.showAmount = false;
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    nip: '1234567890',
                                    address: {
                                        street: 'Test',
                                        buildNr: '5',
                                        flatNr: '9',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'PL'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    nip: '1234567891',
                                    address: {
                                        street: 'Test1',
                                        buildNr: '5',
                                        flatNr: '3',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'UK'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2].text).eql('5000.00');
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                });
                describe('when language pl', function ()
                {
                    before(() =>
                    {
                        companyManager.getCompanyById.reset();
                        let invoiceMock = _.cloneDeep(invoice);
                        invoiceMock.showAmount = false;
                        invoiceMock.language = 'pl';
                        invoiceMock.products['0'].amount = null;
                        companyManager.getCompanyById.withArgs(1).resolves(
                                {
                                    name: 'Firma TEST',
                                    address: {
                                        street: 'Test',
                                        buildNr: '5',
                                        flatNr: '9',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'PL'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345455464565465465464',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        companyManager.getCompanyById.withArgs(2).resolves(
                                {
                                    name: 'Firma TEST2',
                                    address: {
                                        street: 'Test1',
                                        buildNr: '5',
                                        flatNr: '3',
                                        postCode: '44-596',
                                        city: 'Tarnów',
                                        country: 'Polska',
                                        countryCode: 'UK'
                                    },
                                    bankAccounts: {
                                        '0': {
                                            editMode: false,
                                            account: '345 784798375 384753495',
                                            name: 'PLN',
                                            bankName: 'BANK MILLENNIUM S.A.',
                                            swift: 'BIGBPLPW'
                                        }
                                    }
                                });
                        return pdfContenet(invoiceMock).then(content =>
                        {
                            result = content;
                        });
                    });
                    it('should set product table', function ()
                    {
                        expect(result.content[3].table.body[1][0].text).eql(1);
                        expect(result.content[3].table.body[1][1]).eql('IT service');
                        expect(result.content[3].table.body[1][2].text).eql('5000.00');
                    });
                    it('should set subtotal table', function ()
                    {
                        expect(result.content[4].columns[1].table.body[0][1].text).eql('5000.00 USD');
                    });
                });
            });
        });
        describe('when reverse charge false', function ()
        {
            describe('when language en', function ()
            {
                before(() =>
                {
                    companyManager.getCompanyById.reset();
                    let invoiceMock = _.cloneDeep(invoice);
                    invoiceMock.reverseCharge = false;
                    invoiceMock.products = {
                        '0': {
                            editMode: false,
                            amount: 1,
                            unit: 'unit',
                            name: 'IT service',
                            netto: 5000,
                            brutto: 6150,
                            vat: 23
                        }
                    };
                    invoiceMock.bruttoValue = 6150;
                    companyManager.getCompanyById.withArgs(1).resolves(
                            {
                                name: 'Firma TEST',
                                nip: '1234567890',
                                address: {
                                    street: 'Test',
                                    buildNr: '5',
                                    flatNr: '9',
                                    postCode: '44-596',
                                    city: 'Tarnów',
                                    country: 'Polska',
                                    countryCode: 'PL'
                                },
                                bankAccounts: {
                                    '0': {
                                        editMode: false,
                                        account: '345455464565465465464',
                                        name: 'PLN',
                                        bankName: 'BANK MILLENNIUM S.A.',
                                        swift: 'BIGBPLPW'
                                    }
                                }
                            });
                    companyManager.getCompanyById.withArgs(2).resolves(
                            {
                                name: 'Firma TEST2',
                                nip: '1234567891',
                                address: {
                                    street: 'Test1',
                                    buildNr: '5',
                                    flatNr: '3',
                                    postCode: '44-596',
                                    city: 'Tarnów',
                                    country: 'Polska',
                                    countryCode: 'UK'
                                },
                                bankAccounts: {
                                    '0': {
                                        editMode: false,
                                        account: '345 784798375 384753495',
                                        name: 'PLN',
                                        bankName: 'BANK MILLENNIUM S.A.',
                                        swift: 'BIGBPLPW'
                                    }
                                }
                            });
                    return pdfContenet(invoiceMock).then(content =>
                    {
                        result = content;
                    });
                });
                it('should set product table', function ()
                {
                    expect(result.content[3].table.body[1][0].text).eql(1);
                    expect(result.content[3].table.body[1][1]).eql('IT service');
                    expect(result.content[3].table.body[1][2]).eql('szt');
                    expect(result.content[3].table.body[1][3].text).eql(1);
                    expect(result.content[3].table.body[1][4].text).eql(23);
                    expect(result.content[3].table.body[1][5].text).eql('5000.00');
                    expect(result.content[3].table.body[1][6].text).eql('5000.00');
                });
                it('should set subtotal table', function ()
                {
                    expect(result.content[4].columns[1].table.body[1][2].text).eql('5000.00');
                    expect(result.content[4].columns[1].table.body[1][3].text).eql('1150.00');
                    expect(result.content[4].columns[1].table.body[1][4].text).eql('6150.00 USD');
                    expect(result.content[4].columns[1].table.body[2][1].text).eql('23');
                    expect(result.content[4].columns[1].table.body[2][2].text).eql('5000.00');
                    expect(result.content[4].columns[1].table.body[2][3].text).eql('1150.00');
                    expect(result.content[4].columns[1].table.body[2][4].text).eql('6150.00');
                    expect(result.content[4].columns[1].layout.hLineWidth(0)).eql(0);
                    expect(result.content[4].columns[1].layout.hLineWidth(2)).eql(2);

                });
            });
        });

    });

    describe('when contractorType is person', function ()
    {
        before(() =>
        {
            companyManager.getCompanyById.reset();
            let invoiceMock = _.cloneDeep(invoice);
            invoiceMock.contractorType = 'person';
            invoiceMock.personRecipent = 1;
            personManagerMock.getPersonById.withArgs(1).resolves(
                    {
                        firstName: 'John',
                        lastName: 'Smith',
                        nip: '1234567890',
                        address: {
                            street: 'Test',
                            buildNr: '5',
                            flatNr: '9',
                            postCode: '44-596',
                            city: 'Tarnów',
                            country: 'Polska',
                            countryCode: 'PL'
                        },
                        bankAccounts: {
                            '0': {
                                editMode: false,
                                account: '345455464565465465464',
                                name: 'PLN',
                                bankName: 'BANK MILLENNIUM S.A.',
                                swift: 'BIGBPLPW'
                            }
                        }
                    });
            companyManager.getCompanyById.withArgs(2).resolves(
                    {
                        name: 'Firma TEST2',
                        nip: '1234567891',
                        address: {
                            street: 'Test1',
                            buildNr: '5',
                            flatNr: '3',
                            postCode: '44-596',
                            city: 'Tarnów',
                            country: 'Polska',
                            countryCode: 'UK'
                        },
                        bankAccounts: {
                            '0': {
                                editMode: false,
                                account: '345 784798375 384753495',
                                name: 'PLN',
                                bankName: 'BANK MILLENNIUM S.A.',
                                swift: 'BIGBPLPW'
                            }
                        }
                    });
            return pdfContenet(invoiceMock).then(content =>
            {
                result = content;
            });
        });
        it('should call getCompanyById', function ()
        {
            expect(companyManager.getCompanyById).callCount(1);
            expect(companyManager.getCompanyById).calledWith(2);
        });
        it('should call getPersonById', function ()
        {
            expect(personManagerMock.getPersonById).callCount(1);
            expect(personManagerMock.getPersonById).calledWith(1);
        });
        it('should set seller information', function ()
        {
            expect(result.content[0].columns[0].text[0].text).eql('Firma TEST2\n');
            expect(result.content[0].columns[0].text[1].text).eql('Test1 5/3\n');
            expect(result.content[0].columns[0].text[2].text).eql('44-596 Tarnów\n');
            expect(result.content[0].columns[0].text[3].text).eql('NIP: 1234567891\n');
        });
        it('should set createDate, payDate, issuePlace', function ()
        {
            expect(result.content[0].columns[1].table.body[1][0].text).eql('Tarnów');
            expect(result.content[0].columns[1].table.body[3][0].text).eql('2017-06-16');
            expect(result.content[0].columns[1].table.body[5][0].text).eql('2017-06-16');
        });
        it('should layout return 0;', function ()
        {
            expect(result.content[0].columns[1].layout.vLineWidth()).eql(0);
        });
        it('should set seller section', function ()
        {
            expect(result.content[1].columns[0].table.body[1][0].text, 'seller name').eql('Name: Firma TEST2');
            expect(result.content[1].columns[0].table.body[2][0].text, 'seller address').eql('Test1 5/3');
            expect(result.content[1].columns[0].table.body[3][0].text, 'seller postcode').eql('44-596 Tarnów');
            expect(result.content[1].columns[0].table.body[4][0].text[0].text, 'seller NIP').eql('NIP: ');
            expect(result.content[1].columns[0].table.body[4][0].text[1].text, 'seller NIP - country code').eql('UK');
            expect(result.content[1].columns[0].table.body[4][0].text[2].text, 'seller NIP - nip').eql('1234567891');
        });
        it('should set buyer section', function ()
        {
            expect(result.content[1].columns[1].table.body[1][0].text, 'buyer name').eql('Name: John Smith');
            expect(result.content[1].columns[1].table.body[2][0].text, 'buyer address').eql('Test 5/9');
            expect(result.content[1].columns[1].table.body[3][0].text, 'buyer postcode').eql('44-596 Tarnów');
            expect(result.content[1].columns[1].table.body[4][0].text[0].text, 'buyer NIP').eql('NIP: ');
            expect(result.content[1].columns[1].table.body[4][0].text[1].text, 'buyer NIP - country code').eql('PL');
            expect(result.content[1].columns[1].table.body[4][0].text[2].text, 'buyer NIP - nip').eql('1234567890');
        });
    });

    describe('when throw error', function ()
    {
        before(() =>
        {
            companyManager.getCompanyById.reset();
            let invoiceMock = _.cloneDeep(invoice);
            delete invoiceMock.products;
            delete invoiceMock.contractorType;
            companyManager.getCompanyById.withArgs(1).resolves(
                    {
                        nip: '1234567890',
                        address: {
                            street: 'Test',

                        },
                    });
            companyManager.getCompanyById.withArgs(2).resolves(
                    {
                        name: 'Firma TEST2',
                        nip: '1234567891'

                    });
            return pdfContenet(invoiceMock).catch(content =>
            {
                result = content;
            });

        });
        it('should catch error', function ()
        {
            expect(result).eql({
                error: {message: 'ERROR', code: 500},
                message: 'Something wrong in pdfContent'
            })
        });
    });
});
