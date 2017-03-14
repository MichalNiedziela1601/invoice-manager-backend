const contractorManager = require('../business/contractor.manager');

module.exports = function (server)
{

    server.route({
        method: 'GET',
        path: '/api/contractor',
        handler: function (request, replay)
        {
            contractorManager.getContractorCompanyAll().then(result =>
            {
                replay(result);
            })
        }
    })
};

