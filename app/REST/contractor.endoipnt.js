const contractorManager = require('../business/contractor.manager');
const joiSchema = require('../joi.schema');
module.exports = function (server)
{

    server.route({
        method: 'GET', path: '/api/contractor', handler: function (request, reply)
        {
            contractorManager.getContractorCompanyAll().then(result =>
            {
                reply(result);
            })
        }
    });
    server.route({
        method: 'POST', path: '/api/contractor', config: {validate: {payload: joiSchema.schema.contractor}}, handler: function (request, reply)
        {
            contractorManager.addContractorCompany(request.payload).then(() =>
            {
                reply();
            });
        }
    })
};

