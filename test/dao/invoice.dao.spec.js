'use strict';

const expect = require('chai').expect;
const invoiceDAO = require('../../app/dao/invoice.dao');
const data = require('../fixtures/invoice.dao.fixtures');
const testHelper = require('../testHelper');

describe('invoice.dao', function ()
{
    beforeEach(function ()
    {
        return testHelper.clearDB().then(function ()
        {
            return testHelper.seed('test/seed/invoice.dao.sql');
        });
    });

    describe('getInvoices', function ()
    {
        let invoices = [];
        describe('without filter', function ()
        {
            beforeEach(function ()
            {
                return invoiceDAO.getInvoices().then(function (result)
                {
                    invoices = result;
                })
            });
            it('should return all invoices', function ()
            {
                expect(invoices).to.eql(data.invoices);
            });
        });
        describe('with filter', function ()
        {
            describe('sell', function ()
            {
                beforeEach(function ()
                {
                    return invoiceDAO.getInvoices({type: 'Sale'}).then(function (result)
                    {
                        invoices = result;
                    })
                });
                it('should return sell invoices', function ()
                {
                    expect(invoices).to.eql([data.invoices[1], data.invoices[2]]);
                });
            });
            describe('buy', function ()
            {
                beforeEach(function ()
                {
                    return invoiceDAO.getInvoices({type: 'Buy'}).then(function (result)
                    {
                        invoices = result;
                    })
                });
                it('should return buy companies', function ()
                {
                    expect(invoices).to.eql([data.invoices[0]]);
                });
            });
        });
    });

});
