const _ = require('lodash');
const companyManager = require('../business/company.manager');

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
    let description = !_.isUndefined(invoice.description) ?
            [{text: 'Notes: ', bold: true}, {text: invoice.description}] :
            '';

    if (_.some(invoice.products, {'vat': 'N/A'})) {
        invoiceNr = [{text: 'Invoice ' + invoice.invoiceNr}, {text: '\n(reverse charge)', fontSize: 8}];
        listProduct = [[{text: 'Lp', style: 'subheader'}, {text: 'Name', style: 'subheader'}, {text: 'Unit', style: 'subheader'},
            {text: 'Amount', style: 'subheader'}, {text: 'Netto', style: 'subheader'},
            {text: 'Netto Value', style: 'subheader'}]];
        _.forEach(invoice.products, function (product)
        {
            item = [{text: i, alignment: 'center'}, product.name, 'szt', {text: product.amount, style: 'number'},
                {text: parseFloat(product.netto).toFixed(2), style: 'number'},
                {text: (product.netto * product.amount).toFixed(2), style: 'number'}
            ];
            listProduct.push(item);
            netto += product.netto * product.amount;
            brutto += product.brutto;
            i += 1;
        });

        products = {

            table: {
                headerRows: 1,
                widths: ['auto', 160, 'auto', 'auto', '*', '*'],

                body: listProduct
            }

        };

        sum = [[{text: 'Total', style: 'subTotalHeader'},
            {text: brutto.toFixed(2), style: 'number'}]];


        subtotal =
        {
            columns: [
                {
                    width: '40%',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    text: 'Payment Mode',
                                    style: 'subTotalHeader1',
                                    border: [false, false, false, false]
                                },
                                {
                                    text: 'Due Date',
                                    style: 'subTotalHeader1',
                                    border: [false, false, false, false]
                                }],

                            [
                                {
                                    text: invoice.paymentMethod,
                                    border: [false, false, false, false]
                                },
                                {
                                    text: invoice.executionEndDate,
                                    border: [false, false, false, false]
                                }]
                        ]
                    },
                    margin: [0, 10, 0, 0]
                },
                {
                    width: '*',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: sum
                    },

                    margin: [80, 10, 0, 0]
                }
            ]

        }
    } else {
        invoiceNr = 'Invoice ' + invoice.invoiceNr;
        listProduct = [[{text: 'Lp', style: 'subheader'}, {text: 'Name', style: 'subheader'}, {text: 'Unit', style: 'subheader'},
            {text: 'Amount', style: 'subheader'}, {text: 'Vat [%]', style: 'subheader'}, {text: 'Netto', style: 'subheader'},
            {text: 'Netto Value', style: 'subheader'}]];

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
                {text: 'Vat Value', style: 'subTotalHeader'}, {text: 'Brutto', style: 'subTotalHeader'}],
            [{text: 'Total', style: 'subTotalHeader'}, '', {text: netto.toFixed(2), style: 'number'}, {text: vatValue.toFixed(2), style: 'number'},
                {text: brutto.toFixed(2), style: 'number'}]];

        _.forEach(subTotal, (value, key) =>
        {
            nettoValue = 0;
            vatValue = 0;
            bruttoValue = 0;
            summary = [{text: 'including', style: 'subTotalHeader'}, {text: key}];
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
                {
                    width: '40%',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    text: 'Payment Mode',
                                    style: 'subTotalHeader1',
                                    border: [false, false, false]
                                },
                                {
                                    text: 'Due Date',
                                    style: 'subTotalHeader1',
                                    border: [false, false, false]
                                }],

                            [
                                {
                                    text: invoice.paymentMethod,
                                    border: [false, false, false]
                                },
                                {
                                    text: invoice.executionEndDate,
                                    border: [false, false, false]
                                }]
                        ]
                    },
                    margin: [0, 10, 0, 0]
                },
                {
                    width: '*',
                    table: {
                        headerRows: 2,
                        widths: ['*', '*', '*', '*', '*'],
                        body: sum
                    },
                    layout: {
                        hLineWidth: function (i)
                        {
                            return i === 2 ? 2 : 0
                        }
                    },
                    margin: [0, 10, 0, 0]
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
                        width: 350,
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
                                [{text: 'Create Date', style: 'header'}],
                                [{text: invoice.createDate, alignment: 'center', style: 'noBorder'}],
                                [{text: 'Due Date', style: 'header'}],
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
                                    {text: 'Seller', alignment: 'center', fontSize: 11, fillColor: '#CCCCCC', margin: [10, 0, 0, 0]}],
                                [{text: seller.name}],
                                [{
                                    text: seller.address.street + ' ' + seller.address.buildNr +
                                    '' + (seller.address.flatNr ?
                                    '/' + seller.address.flatNr :
                                            '')
                                }],
                                [{text: seller.address.postCode + ' ' + seller.address.city}],
                                [
                                    {
                                        text: [{text: 'NIP: ', bold: true}, {text: seller.nip}],
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
                                [{text: 'Buyer', alignment: 'center', fillColor: '#CCCCCC', fontSize: 11, margin: [10, 0, 0, 0]}],
                                [{text: recipient.name}],
                                [{
                                    text: recipient.address.street + ' ' + recipient.address.buildNr +
                                    '' + (recipient.address.flatNr ?
                                    '/' + recipient.address.flatNr :
                                            '')
                                }],
                                [{text: recipient.address.postCode + ' ' + recipient.address.city}],
                                [{
                                    text: [{text: 'NIP: ', bold: true}, {text: recipient.nip}],
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
                text: description
            },
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
            {
                columns: subtotal.columns
            },

            {
                style: 'noBorder',
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            {
                                text: 'Total to pay',
                                border: [false, false, false, false],
                                bold: true,
                                margin: [10, 0, 0, 0]
                            },
                            {
                                text: brutto.toFixed(2),
                                style: 'number',
                                bold: true,
                                border: [false, false, false, false],
                                margin: [0, 0, 10, 0]
                            }],
                        [
                            {text: 'Paid: ' + (invoice.advance || 0).toFixed(2), border: [false, false, false, true], bold: true, margin: [10, 0, 0, 0]},
                            {
                                text: 'Rest to pay: ' + (brutto - (invoice.advance || 0)).toFixed(2),
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
        return companyManager.getCompanyById(invoice.companyRecipent);
    }).then(companyRecipient =>
    {
        recipient = companyRecipient;
        return pdfContent(invoice, seller, recipient);
    });
}

module.exports = generate;

