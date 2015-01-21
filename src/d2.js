/* global global */
'use strict';
require('when/es6-shim/Promise.browserify-es6');

var check = require('d2/lib/check');
var logger = new (require('d2/logger/Logger'))(global.console);
var model = require('d2/model');
var Api = require('d2/api/Api');

var d2 = {
    models: new model.ModelDefinitions(),
    model: model,
    Api: Api
};

module.exports = function (config) {
    var api = Api.getApi();

    if (config && check.checkType(config, 'object', 'Config parameter')) {
        processConfig(api, config);
    }

    return api.get('schemas')
        .then(function (schemas) {
            schemas.forEach(function (schema) {
                d2.models.add(model.ModelDefinition.createFromSchema(schema));
            });

            return d2;
        })
        .catch(function (error) {
            logger.error('Unable to get schemas from the api', error);

            return Promise.reject(error);
        });
};

function processConfig(api, config) {
    if (check.isString(config.baseUrl)) {
        api.setBaseUrl(config.baseUrl);
    }
}

/* istanbul ignore next */
(function (global) {
    if (global.document) {
        global.d2 = module.exports;
    }

})(typeof window !== 'undefined' ? window : module.exports);
