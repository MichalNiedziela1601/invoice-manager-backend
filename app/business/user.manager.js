'use strict';
const userDAO = require('../dao/user.dao');

function getUserById(id)
{
    return userDAO.getUserById(id);
}

module.exports = {
    getUserById
};
