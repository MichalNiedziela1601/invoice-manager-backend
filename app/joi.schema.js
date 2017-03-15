const Joi = require('joi');

module.exports = {
    schema: {
        validation: {
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
        company: {
            name: Joi.string().min(2).required(),
            nip: Joi.number().required(),
            regon: Joi.number(),
            email: Joi.string().email(),
            address: Joi.number().required()
        }
    }
};
