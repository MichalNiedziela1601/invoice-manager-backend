'use strict';
const contractorDao = require('../dao/contractor.dao');

function getAll()
{
    return contractorDao.getAll();
}

module.exports = {
    getAll
};
