'use strict';
const _ = require('lodash');
function parseObj(obj)
{
    return _.mapKeys(obj, function (value, key)
    {
        return _.camelCase(key);
    });
}

function parseArrayOfObject(array)
{
    return _.map(array, function (val)
    {
        return parseObj(val);
    })
}

module.exports = {
    parseObj, parseArrayOfObject
};
