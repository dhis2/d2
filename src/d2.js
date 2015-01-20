'use strict';
require('when/es6-shim/Promise');

module.exports.model = require('d2/model');
module.exports.api = require('d2/api/Api');

/* istanbul ignore next */
(function (global) {
    if (global.document) {
        global.d2 = this;
    }

})(typeof window !== 'undefined' ? window : module.exports);
