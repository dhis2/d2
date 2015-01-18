'use strict';
require('when/es6-shim/Promise');

require('./lib/utils');
require('./lib/check');

var ModelDefinitions = require('d2/model/ModelDefinitions');

module.exports.model = require('d2/model');

console.log(module.exports.model);