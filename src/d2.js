'use strict';

import {pick} from 'd2/lib/utils';
import {checkType, isString} from 'd2/lib/check';
import Logger from 'd2/logger/Logger';
import model from 'd2/model/models';
import Api from 'd2/api/Api';

/**
 * @function
 *
 * @name d2Init
 * @param {Object} config Configuration object that will be used to configure to define D2 Setting.
 * See the description for more information on the available settings.
 * @returns {Object} D2 object that exposes `model`, `models` and `Api`
 *
 * @description
 * Init function that used to initialise D2. This will load the schemas from the DHIS2 api and configure your D2 instance.
 *
 * The `options` object that can be passed into D2 can have the following properties:
 *
 * baseUrl: Set this when the url is something different then `/api`. If you are running your dhis instance in a subdirectory of the actual domain
 * for example http://localhost/dhis/ you should set the base url to `/dhis/api`
 */
function d2Init(config) {
    var logger = Logger.getLogger();

    var d2 = {
        models: undefined,
        model: model,
        Api: Api
    };

    var api = Api.getApi();

    if (config && checkType(config, 'object', 'Config parameter')) {
        processConfig(api, config);
    }

    model.ModelDefinition.prototype.api = api;

    d2.models = new model.ModelDefinitions();

    return api.get('schemas')
        .then(pick('schemas'))
        .then((schemas) => {
            schemas.forEach((schema) => {
                d2.models.add(model.ModelDefinition.createFromSchema(schema));
            });

            return d2;
        })
        .catch((error) => {
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

if (typeof window !== 'undefined') {
    window.d2 = d2Init;
}

export default d2Init;
