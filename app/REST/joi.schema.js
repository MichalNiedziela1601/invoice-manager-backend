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
            currency: Joi.string()
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
            month: Joi.required()
        },
        company: {
            name: Joi.string().min(2).required(),
            nip: Joi.number().required(),
            regon: Joi.number(),
            address: {
                street: Joi.string().required(),
                buildNr: Joi.string().required(),
                flatNr: Joi.any().optional(),
                postCode: Joi.string().regex(/^\d{2}-\d{3}$/).required(),
                city: Joi.string().required(),
                id: Joi.number().optional()
            }
        },
        registerCompany: {
            name: Joi.string().required().min(2),
            nip: Joi.number().required(),
            email: Joi.string().email(),
            password: Joi.string().min(4).required()
        },
        address: {
            street: Joi.string().required(),
            buildNr: Joi.string().required(),
            flatNr: Joi.any().optional(),
            postCode: Joi.string().regex(/^\d{2}-\d{3}$/).required(),
            city: Joi.string().required(),
            id: Joi.number()
        },
        account: {
            bankName: Joi.string().required(),
            bankAccount: Joi.string().required(),
            swift: Joi.string().optional()
        }
    }
};
