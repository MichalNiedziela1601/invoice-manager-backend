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
            url: Joi.string().alphanum().required(),
            companyDealer: [Joi.number().integer(), Joi.allow(null)],
            companyRecipent: [Joi.number().integer(), Joi.allow(null)],
            personDealer: [Joi.number().integer(), Joi.allow(null)],
            personRecipent: [Joi.number().integer(), Joi.allow(null)]
        },
        invoiceById: {
            id: Joi.number().min(1).required()
        },
        companyByNip: {
            nip: Joi.number().required()
        },
        invoiceType: {
            type: Joi.valid('Buy', 'Sale').required()
        },
        company: {
            name: Joi.string().min(2).required(),
            nip: Joi.number().required(),
            regon: Joi.number(),
            email: Joi.string().email(),
            address: Joi.object().required()
        },
        registerCompany: {
            name: Joi.string().required().min(2),
            nip: Joi.number().required(),
            email: Joi.string().email(),
            password: Joi.string().min(4).required()
        }
    }
};