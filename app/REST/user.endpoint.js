'use strict';
const companyManager = require('../business/company.manager');

module.exports = function(server){

    server.route({
        method: 'POST',
        path: '/api/user/addAddress',
        config: { auth: 'token'},
        handler: function(request,reply){
            let companyId = request.auth.credentials.company.id;
            let address = request.payload;
            companyManager.updateCompanyAddress(address,companyId).then(() => {
                reply();
            })
        }
    })
};
