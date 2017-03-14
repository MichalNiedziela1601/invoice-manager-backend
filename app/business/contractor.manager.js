'use strict';
const contractorDao = require('../dao/contractor.dao');

function getContractorCompanyAll()
{
    return contractorDao.getContractorCompanyAll();
}

module.exports = {
    getContractorCompanyAll
};
