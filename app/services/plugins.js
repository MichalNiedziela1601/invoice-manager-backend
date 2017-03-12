'use script';
const goodPlugin = require('./plugins/good.plugin');

module.exports = function(server){
    goodPlugin(server);
};
