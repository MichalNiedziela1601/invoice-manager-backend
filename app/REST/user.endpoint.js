'use strict';
const companyManager = require('../business/company.manager');
//TODO catch block everywhere and use application exceptions
module.exports = function (server)
{

    server.route({
        method: 'POST',
        path: '/api/user/addAddress',
        config: {auth: 'token'},
        handler: function (request, reply)
        {
            //TODO use lodash get for deeply nested object
            const companyId = request.auth.credentials.company.id;
            const address = request.payload;
            companyManager.updateCompanyAddress(address, companyId).then(() =>
            {
                reply();
            })
        }
    })
};
