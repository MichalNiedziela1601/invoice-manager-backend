'use strict';
const companyDao = require('../dao/company.dao.js');

function getCompanyAll()
{
    return companyDao.getCompanyAll();
}
function addCompany(company)
{
    return companyDao.addCompany(company)
}

module.exports = {
    getCompanyAll, addCompany
};
