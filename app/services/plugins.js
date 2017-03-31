'use strict';
const goodPlugin = require('./plugins/good.plugin');
const jwtPlugin = require('./plugins/jwt.plugin');

module.exports = function(server){
    goodPlugin(server);
    jwtPlugin(server);
};
