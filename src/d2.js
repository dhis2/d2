'use strict';

import {pick} from './lib/utils';
import {checkType, isString} from './lib/check';

//TODO: Figure out a way how to mock import statements so we can mock dependencies
var logger = require('d2/logger/Logger').getLogger();
var model = require('d2/model');
var Api = require('d2/api/Api');

var d2 = {
    models: undefined,
    model: model,
    Api: Api
};

function d2Init(config) {
    var api = Api.getApi();

    if (config && checkType(config, 'object', 'Config parameter')) {
        processConfig(api, config);
    }

    model.ModelDefinition.prototype.api = api;

    d2.models = new model.ModelDefinitions();

    return api.get('schemas')
        .then(pick('schemas'))
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
}

function processConfig(api, config) {
    if (isString(config.baseUrl)) {
        api.setBaseUrl(config.baseUrl);
    } else {
        api.setBaseUrl('/api');
    }
}

/* istanbul ignore next */
(function (global) {
    if (global.document) {
        global.d2 = module.exports;
    }

})(typeof window !== 'undefined' ? window : module.exports);

export default d2Init;
