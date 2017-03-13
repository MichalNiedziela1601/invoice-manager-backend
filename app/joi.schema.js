const Joi = require('joi');

module.exports = {
    schema: {
        validation: {
            invoice_nr: Joi.required(),
            type: Joi.string().alphanum().required(),
            create_date: Joi.date().required(),
            execution_end_date: Joi.date().required(),
            netto_value: Joi.number().required(),
            brutto_value: Joi.number().required(),
            status: Joi.valid("paid", "unpaid").required(),
            url: Joi.string().alphanum().required(),
            company_dealer: [Joi.number().integer(), Joi.allow(null)],
            company_recipent: [Joi.number().integer(), Joi.allow(null)],
            person_dealer: [Joi.number().integer(), Joi.allow(null)],
            person_recipent: [Joi.number().integer(), Joi.allow(null)]
        }
    }
};
