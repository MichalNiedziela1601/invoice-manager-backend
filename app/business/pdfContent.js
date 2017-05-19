const _ = require('lodash');
const companyManager = require('./company.manager.js');
const translate = require('./../REST/translationInvoice');
const personManager = require('./person.manager.js');
const appException = require('../services/applicationException');

function pdfContent(invoice, seller, recipient)
{
    let listProduct = {};
    let nettoValue = 0;
    let vatValue = 0;
    let bruttoValue = 0;
    let netto = 0;
    let brutto = 0;
    let subTotal = {};
    let summary = {};
    let sum = {};
    let item = {};
    let subtotal = {};
    let products = {};
    let i = 1;
    let invoiceNr = '';
    let lang = invoice.language;

    let description = !_.isUndefined(invoice.description) ?
            [{text: translate[lang].notes + ': ', bold: true}, {text: invoice.description}] :
            '';

    if (invoice.reverseCharge) {
        invoiceNr = [
            {text: translate[lang].invoice + ('pl' === lang ? ' (' + translate['en'].invoice + ') ' : ' ') + invoice.invoiceNr + ''},
            {
                text: '\n(' + translate[lang].reverseCharge + ('pl' === lang ? ' (' + translate['en'].reverseCharge + ') )' : ')'),
                fontSize: 8
            }];
        if (invoice.showAmount) {
            listProduct = [
                [
                    {text: translate[lang].no, style: 'subheader'},
                    {text: translate[lang].serviceName + ('pl' === lang ? '\n(' + translate['en'].serviceName + ')' : ''), style: 'subheader'},
                    {text: translate[lang].amount + ('pl' === lang ? '\n(' + translate['en'].amount + ')' : ''), style: 'subheader'},
                    {text: translate[lang].unit + ('pl' === lang ? '\n(' + translate['en'].unit + ')' : ''), style: 'subheader'},
                    {text: translate[lang].unitPrice + ('pl' === lang ? '\n(' + translate['en'].unitPrice : ''), style: 'subheader'},
                    {text: translate[lang].value + ('pl' === lang ? '\n(' + translate['en'].value + ')' : ''), style: 'subheader'}]];
            _.forEach(invoice.products, function (product)
            {
                item = [{text: i, alignment: 'center'}, product.name, product.amount, product.unit, {text: Number(product.netto).toFixed(2), style: 'number'},
                    {text: (product.netto * (product.amount || 1)).toFixed(2), style: 'number'}
                ];
                listProduct.push(item);
                netto += product.netto * (product.amount || 1);
                brutto += product.brutto;
                i += 1;
            });
            products = {

                table: {
                    headerRows: 1,
                    widths: ['auto', 240, '*', '*', '*', '*'],

                    body: listProduct
                }

            };
        } else {
            listProduct = [
                [
                    {text: translate[lang].no, style: 'subheader'},
                    {text: translate[lang].serviceName + ('pl' === lang ? '\n(' + translate['en'].serviceName + ')' : ''), style: 'subheader'},
                    {text: translate[lang].value + ('pl' === lang ? '\n(' + translate['en'].value + ')' : ''), style: 'subheader'}]];
            _.forEach(invoice.products, function (product)
            {
                item = [{text: i, alignment: 'center'}, product.name,
                    {text: (product.netto * (product.amount || 1)).toFixed(2), style: 'number'}
                ];
                listProduct.push(item);
                netto += product.netto * (product.amount || 1);
                brutto += product.brutto;
                i += 1;
            });
            products = {

                table: {
                    headerRows: 1,
                    widths: ['auto', 250, '*'],

                    body: listProduct
                }

            };
        }

        sum = [[{text: translate[lang].total + ('pl' === lang ? '(' + translate['en'].total + ')' : ''), style: 'subTotalHeader'},
            {text: brutto.toFixed(2) + ' ' + invoice.currency, style: 'number'}]];


        subtotal =
        {
            columns: [
                {text: '', width: '*'},
                {
                    width: 240,
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: sum
                    },

                    margin: [0, 10, 0, 10]
                }
            ]

        }
    } else {
        invoiceNr = translate[lang].invoice + ' ' + invoice.invoiceNr;
        listProduct = [[{text: translate[lang].no, style: 'subheader'}, {text: translate[lang].serviceName, style: 'subheader'},
            {text: translate[lang].unit, style: 'subheader'},
            {text: translate[lang].amount, style: 'subheader'}, {text: 'Vat [%]', style: 'subheader'},
            {text: translate[lang].unitPrice, style: 'subheader'},
            {text: translate[lang].value, style: 'subheader'}]];

        _.forEach(invoice.products, function (product)
        {
            item = [{text: i, alignment: 'center'}, product.name, 'szt', {text: product.amount, style: 'number'},
                {text: product.vat, style: 'number'}, {text: (product.netto).toFixed(2), style: 'number'},
                {text: (product.netto * product.amount).toFixed(2), style: 'number'}
            ];
            listProduct.push(item);
            netto += product.netto * product.amount;
            vatValue += product.brutto - product.netto * product.amount;
            brutto += product.brutto;
            i += 1;
        });


        products = {

            table: {
                headerRows: 1,
                widths: ['auto', 160, 'auto', 'auto', '*', '*', '*'],

                body: listProduct
            }

        };
        subTotal = _.reduce(invoice.products, function (result, value)
        {
            (result[value.vat] || (result[value.vat] = [])).push(value);
            return result;
        }, {});

        sum = [
            [{text: '', style: 'subTotalHeader'}, {text: 'Vat %', style: 'subTotalHeader'}, {text: 'Netto', style: 'subTotalHeader'},
                {text: translate[lang].vatValue, style: 'subTotalHeader'}, {text: 'Brutto', style: 'subTotalHeader'}],
            [{text: translate[lang].total, style: 'subTotalHeader'}, '', {text: netto.toFixed(2), style: 'number'},
                {text: vatValue.toFixed(2), style: 'number'},
                {text: brutto.toFixed(2) + ' ' + invoice.currency, style: 'number'}]];

        _.forEach(subTotal, (value, key) =>
        {
            nettoValue = 0;
            vatValue = 0;
            bruttoValue = 0;
            summary = [{text: translate[lang].including, style: 'subTotalHeader'}, {text: key}];
            _.forEach(value, val =>
            {
                nettoValue += val.netto * val.amount;
                vatValue += val.brutto - val.netto * val.amount;
                bruttoValue += val.brutto;

            });
            summary.push({text: nettoValue.toFixed(2), style: 'number'});
            summary.push({text: vatValue.toFixed(2), style: 'number'});
            summary.push({text: bruttoValue.toFixed(2), style: 'number'});
            sum.push(summary);
        });

        subtotal =
        {

            columns: [
                {text: '', width: '30%'},
                {
                    width: '*',
                    table: {
                        headerRows: 2,
                        widths: ['auto', 'auto', '*', '*', '*'],
                        body: sum
                    },
                    layout: {
                        hLineWidth: function (i)
                        {
                            return i === 2 ? 2 : 0
                        }
                    },
                    margin: [0, 10, 0, 10]
                }
            ]
        }
    }


    let docContent = {
        content: [
            {
                style: {
                    columnGap: 20
                },
                columns: [
                    {
                        width: 300,
                        text: [
                            {text: seller.name + '\n', bold: true, fillColor: '#eaeaea'},
                            {
                                text: seller.address.street + ' ' + seller.address.buildNr +
                                (seller.address.flatNr ? '/' + seller.address.flatNr : '') + '\n'
                            },
                            {text: seller.address.postCode + ' ' + seller.address.city + '\n'},
                            {text: 'NIP: ' + seller.nip + '\n'}
                        ],
                        margin: [0, 0, 0, 10]
                    },
                    {

                        table: {
                            alignment: 'right',
                            headerRows: 1,
                            widths: ['*'],
                            body: [
                                [{text: translate[lang].issuePlace, style: 'header'}],
                                [{text: seller.address.city, style: 'noBorder', alignment: 'center'}],
                                [{text: translate[lang].issueDate, style: 'header'}],
                                [{text: invoice.createDate, alignment: 'center', style: 'noBorder'}],
                                [{text: translate[lang].payDue, style: 'header'}],
                                [{text: invoice.executionEndDate, alignment: 'center'}]
                            ]
                        },
                        margin: [0, 0, 0, 15],
                        layout: {
                            vLineWidth: function ()
                            {
                                return 0;
                            }
                        }

                    }
                ]
            },

            {
                columns: [
                    {
                        width: '*',
                        table: {
                            headerRows: 1,
                            widths: ['*'],
                            body: [
                                [
                                    {text: translate[lang].seller, alignment: 'center', fontSize: 11, fillColor: '#CCCCCC', margin: [10, 0, 0, 0]}],
                                [{text: translate[lang].name + ': ' + seller.name}],
                                [{
                                    text: seller.address.street + ' ' + seller.address.buildNr +
                                    '' + (seller.address.flatNr ?
                                    '/' + seller.address.flatNr :
                                            '')
                                }],
                                [{text: seller.address.postCode + ' ' + seller.address.city}],
                                [
                                    {
                                        text: [{text: (seller.nip ? 'NIP: ' : ''), bold: true}, {text: seller.nip}],
                                        margin: [0, 0, 0, 20]
                                    }]
                            ]
                        },
                        layout: 'headerLineOnly'
                    },
                    {
                        width: '*',
                        table: {
                            headerRows: 1,
                            widths: ['*'],
                            body: [
                                [{text: translate[lang].buyer, alignment: 'center', fillColor: '#CCCCCC', fontSize: 11, margin: [10, 0, 0, 0]}],
                                [{
                                    text: translate[lang].name +
                                    ': ' +
                                    ('company' === invoice.contractorType ? recipient.name : recipient.firstName + ' ' + recipient.lastName)
                                }],
                                [{
                                    text: recipient.address.street + ' ' + recipient.address.buildNr +
                                    '' + (recipient.address.flatNr ?
                                    '/' + recipient.address.flatNr :
                                            '')
                                }],
                                [{text: recipient.address.postCode + ' ' + recipient.address.city}],
                                [{
                                    text: [{text: (recipient.nip ? 'NIP: ' : ''), bold: true}, {text: recipient.nip}],
                                    margin: [0, 0, 0, 20]
                                }]
                            ]
                        },
                        layout: 'headerLineOnly'
                    }
                ],
                style: {
                    columnGap: 20

                }
            },
            {text: invoiceNr, fontSize: 18, alignment: 'center', margin: [0, 10, 0, 10]},

            {
                style: {
                    fontSize: 11
                },
                table: products.table,
                layout: {
                    fillColor: function (i)
                    {
                        return i === 0 ?
                                '#CCCCCC'
                                : null;
                    }
                },
                margin: [0, 5, 0, 0]
            },
            subtotal,
            {
                columns: [{
                    width: '40%',

                    text: [{text: translate[lang].paymentType + ':\n', bold: true},
                        {text: translate[lang].payDue + '\n', bold: true},
                        {text: translate[lang].bankAccount + '\n', bold: true},
                        {text: translate[lang].swift, bold: true}
                    ]


                }, {
                    width: '*',
                    text: [('bank transfer' === invoice.paymentMethod ? translate[lang].bankTransfer : translate[lang].cash) + '\n',
                           invoice.executionEndDate + '\n',
                           seller.bankAccount + '\n',
                           seller.swift]
                }
                ],
            },
            {
                text: description
            },
            {
                style: 'noBorder',
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            {
                                text: translate[lang].total + ('pl' === lang ? '(' + translate['en'].total + ')' : ''),
                                border: [false, false, false, false],
                                bold: true,
                                margin: [10, 0, 0, 0]
                            },
                            {
                                text: brutto.toFixed(2) + ' ' + invoice.currency,
                                style: 'number',
                                bold: true,
                                border: [false, false, false, false],
                                margin: [0, 0, 10, 0]
                            }],
                        [
                            {
                                text: translate[lang].advance + ': ' + (invoice.advance || 0).toFixed(2) + ' ' + invoice.currency,
                                border: [false, false, false, true],
                                bold: true,
                                margin: [10, 0, 0, 0]
                            },
                            {
                                text: translate[lang].amountDue + ': ' + (brutto - (invoice.advance || 0)).toFixed(2) + ' ' + invoice.currency,
                                margin: [0, 0, 10, 0],
                                border: [false, false, false, true],
                                style: 'number',
                                bold: true
                            }
                        ]
                    ]
                },
                layout: {
                    fillColor: function (i)
                    {
                        return i === 0 ?
                                '#CCCCCC'
                                : null;
                    }
                },
                absolutePosition: {x: 40, y: 690}
            }

        ],
        styles: {
            header: {
                fontSize: 11,
                bold: true,
                fillColor: '#CCCCCC',
                alignment: 'center'
            },
            subheader: {
                fillColor: '#CCCCCC',
                alignment: 'center'
            },
            number: {
                alignment: 'right'
            },
            noBorder: {
                border: [false, false, false, false]
            },
            bottomBorder: {
                hLineWidth: 2
            },
            subTotalHeader: {
                fontSize: 10,
                fillColor: '#CCCCCC',
                alignment: 'center'
            },
            subTotalHeader1: {
                fontSize: 10,
                fillColor: '#CCCCCC',
                alignment: 'left'
            }
        },
        defaultStyle: {
            fontSize: 10
        }
    };


    return docContent;
}

function generate(invoice)
{
    let seller = {};
    let recipient = {};
    return companyManager.getCompanyById(invoice.companyDealer).then(dealer =>
    {
        seller = dealer;
        if ('company' === invoice.contractorType) {
            return companyManager.getCompanyById(invoice.companyRecipent);
        } else if ('person' === invoice.contractorType) {
            return personManager.getPersonById(invoice.personRecipent);
        }
    }).then(companyRecipient =>
    {
        recipient = companyRecipient;
        try {
            return pdfContent(invoice, seller, recipient);
        } catch (error) {
            throw appException.new(appException.ERROR,'Something wrong in pdfContent');
        }
    });
}

module.exports = generate;

