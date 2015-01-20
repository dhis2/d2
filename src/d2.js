'use strict';
require('when/es6-shim/Promise.browserify-es6');

module.exports.model = require('d2/model');
module.exports.api = require('d2/api/Api');

/* istanbul ignore next */
(function (global) {
    if (global.document) {
        global.d2 = module.exports;
    }

})(typeof window !== 'undefined' ? window : module.exports);
