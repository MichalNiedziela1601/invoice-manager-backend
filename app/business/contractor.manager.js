'use strict';
const contractorDao = require('../dao/contractor.dao');

function getContractorCompanyAll()
{
    return contractorDao.getContractorCompanyAll();
}
function addContractorCompany(contractor)
{
    return contractorDao.addContractorCompany(contractor)
}

module.exports = {
    getContractorCompanyAll, addContractorCompany
};
