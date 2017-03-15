const companyManager = require('../business/company.manager.js');
const joiSchema = require('../joi.schema');
module.exports = function (server)
{

    server.route({
        method: 'GET',
        path: '/api/company',
        handler: function (request, reply)
        {
            companyManager.getCompanyAll().then(result =>
            {
                reply(result);
            })
        }
    });
    server.route({
        method: 'POST',
        path: '/api/company',
        config: {validate: {payload: joiSchema.schema.company}},
        handler: function (request, reply)
        {
            companyManager.addCompany(request.payload).then(() =>
            {
                reply();
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/api/company/{nip}',
        handler: function (request, reply)
        {
            let nip = encodeURIComponent(request.params.nip);
            companyManager.findCompanyByNip(nip).then(company => {
                reply(company);
            })
        }
    })
};

