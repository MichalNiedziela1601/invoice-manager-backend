'use strict';
const Joi = require('joi');

module.exports = {
    schema: {
        invoice: {
            invoiceNr: Joi.required(),
            type: Joi.string().alphanum().required(),
            createDate: Joi.date().required(),
            executionEndDate: Joi.date().required(),
            nettoValue: Joi.number().required(),
            bruttoValue: Joi.number().required(),
            status: Joi.valid('paid', 'unpaid').required(),
            url: Joi.string(),
            companyDealer: [Joi.number().integer(), Joi.allow(null)],
            companyRecipent: [Joi.number().integer(), Joi.allow(null)],
            personDealer: [Joi.number().integer(), Joi.allow(null)],
            personRecipent: [Joi.number().integer(), Joi.allow(null)],
            contractorType: Joi.string(),
            products: Joi.required(),
            reverseCharge: Joi.boolean(),
            paymentMethod: Joi.string(),
            currency: Joi.string(),
            dealerAccountNr: Joi.string()
        },
        invoiceById: {
            id: Joi.number().min(1).required()
        },
        companyByNip: {
            nip: Joi.string().required()
        },
        invoiceType: {
            type: Joi.valid('buy', 'sell').required()
        },
        invoiceGetNumber: {
            year: Joi.required(),
            month: Joi.required(),
            type: Joi.required()
        },
        company: {
            name: Joi.string().min(2).required(),
            nip: [Joi.string(), Joi.allow(null)],
            regon: [Joi.number(),Joi.allow(null)],
            shortcut: Joi.string(),
            bankAccounts: Joi.any(),
            address: {
                street: Joi.string().required(),
                buildNr: Joi.string().required(),
                flatNr: Joi.any().optional(),
                postCode: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string(),
                countryCode: Joi.string(),
                id: Joi.number().optional()
            }
        },
        registerCompany: {
            name: Joi.string().required().min(2),
            nip: Joi.number().required(),
            email: Joi.string().email(),
            password: Joi.string().min(4).required()
        },
        updatedCompany: {
            name: Joi.string().min(2).required(),
            nip: [Joi.string(), Joi.allow(null)],
            regon: [Joi.number(),Joi.allow(null)],
            shortcut: Joi.string(),
            bankAccounts: Joi.any(),
            id: Joi.number(),
            addressId: Joi.number(),
            googleCompanyId: [Joi.string(),Joi.allow(null)],
            swift: [Joi.string(),Joi.allow(null)],
            address: {
                street: Joi.string().required(),
                buildNr: Joi.string().required(),
                flatNr: Joi.any().optional(),
                postCode: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string(),
                countryCode: Joi.string(),
                id: Joi.number().optional()
            }
        },
        address: {
            street: Joi.string().required(),
            buildNr: Joi.string().required(),
            flatNr: Joi.any().optional(),
            postCode: Joi.string().regex(/^\d{2}-\d{3}$/).required(),
            city: Joi.string().required(),
            country: Joi.string().optional(),
            countryCode: Joi.string(),
            id: Joi.number()
        },
        account: {
            bankName: Joi.required(),
            account: Joi.required(),
            swift: Joi.optional(),
            currency: Joi.required()
        },
        person: {
            firstName: Joi.string().min(2).required(),
            lastName: Joi.string().min(2).required(),
            nip: [Joi.string(), Joi.allow(null)],
            shortcut: Joi.string(),
            bankAccounts: Joi.any(),
            address: {
                street: Joi.string().required(),
                buildNr: Joi.string().required(),
                flatNr: Joi.any().optional(),
                postCode: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string(),
                countryCode: Joi.string(),
                id: Joi.number().optional()
            }
        },
        updatedPerson: {
            firstName: Joi.string().min(2).required(),
            lastName: Joi.string().min(2).required(),
            nip: [Joi.string(), Joi.allow(null)],
            shortcut: Joi.string(),
            id: Joi.number(),
            addressId: Joi.number(),
            googlePersonId: [Joi.string(),Joi.allow(null)],
            bankAccounts: Joi.any(),
            address: {
                street: Joi.string().required(),
                buildNr: Joi.string().required(),
                flatNr: Joi.any().optional(),
                postCode: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string(),
                countryCode: Joi.string(),
                id: Joi.number().optional()
            }
        },
    }
};
