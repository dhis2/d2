import 'whatwg-fetch';
import { pick, Deferred, updateAPIUrlWithBaseUrlVersionNumber } from './lib/utils';
import Logger from './logger/Logger';
import model from './model/models';
import Api from './api/Api';
import System from './system/System';
import I18n from './i18n/I18n';
import Config from './config';
import CurrentUser from './current-user/CurrentUser';
import { fieldsForSchemas } from './model/config';
import DataStore from './datastore/DataStore';

let firstRun = true;
let deferredD2Init = Deferred.create();

const preInitConfig = Config.create();

/**
 * @function getManifest
 *
 * @description
 * Utility function to load the app manifest.
 *
 * The manifest well be enhanced with a `getBaseUrl()` utility function that will return the base url of the DHIS2 instance.
 * This is a simple getter for the `activities.dhis.href` property on the manifest.
 *
 * ```js
 * import { getManifest } from 'd2/lib/d2';
 *
 * getManifest()
 *   .then(manifest => {
 *      console.log(manifest.getBaseUrl());
 *   });
 * ```
 *
 * @param {string} url The location of the manifest. Generally this is located in the root of your app folder. (e.g. './manifest.webapp)
 * @param {Api} [ApiClass] An implementation of the Api class that will be used to fetch the manifest.
 *
 * @returns {Promise} Returns a Promise to  the DHIS2 app manifest with the added `getBaseUrl` method.
 */
export function getManifest(url, ApiClass = Api) {
    const api = ApiClass.getApi();
    api.setBaseUrl('');

    const manifestUtilities = {
        getBaseUrl() {
            return this.activities.dhis.href;
        },
    };

    return api.get(`${url}`)
        .then(manifest => Object.assign({}, manifest, manifestUtilities));
}


/**
 * @function getUserSettings
 *
 * @returns {Promise} A promise to the current user settings
 *
 * @description
 * The object that is the result of the promise will have the following properties
 * ```js
 * {
 *   "uiLocale": "en" // The users locale, that can be used for translations)
 * }
 * ```
 */
export function getUserSettings(ApiClass = Api) {
    const api = ApiClass.getApi();

    if (preInitConfig.baseUrl && firstRun) {
        api.setBaseUrl(preInitConfig.baseUrl);
    }

    return api.get('userSettings');
}

function getModelRequests(api, schemaNames) {
    const modelRequests = [];
    const loadSchemaForName = schemaName => api.get(`schemas/${schemaName}`, { fields: fieldsForSchemas });

    if (Array.isArray(schemaNames)) {
        const individualSchemaRequests = schemaNames.map(loadSchemaForName).concat([]);

        const schemasPromise = Promise
            .all(individualSchemaRequests)
            .then(schemas => ({ schemas }));

        modelRequests.push(schemasPromise);

        if (schemaNames.length > 0) {
            // If schemas are loaded, attributes should be as well
            modelRequests.push(api.get('attributes', { fields: ':all,optionSet[:all,options[:all]]', paging: false }));
        } else {
            // Otherwise, just return an empty list of attributes
            modelRequests.push({ attributes: [] });
        }
    } else {
        // If no schemas are specified, load all schemas and attributes
        modelRequests.push(api.get('schemas', { fields: fieldsForSchemas }));
        modelRequests.push(api.get('attributes', { fields: ':all,optionSet[:all,options[:all]]', paging: false }));
    }


    return modelRequests;
}

/**
 * @function init
 *
 * @param {Object} initConfig Configuration object that will be used to configure to define D2 Setting.
 * See the description for more information on the available settings.
 * @returns {Promise} A promise that resolves with the intialized d2 object. Which is an object that exposes `model`, `models` and `Api`
 *
 * @description
 * Init function that used to initialise D2. This will load the schemas from the DHIS2 api and configure your D2 instance.
 *
 * The `config` object that can be passed into D2 can have the following properties:
 *
 * baseUrl: Set this when the url is something different then `/api`. If you are running your dhis instance in a subdirectory of the actual domain
 * for example http://localhost/dhis/ you should set the base url to `/dhis/api`
 *
 * ```js
 * import init from 'd2';
 *
 * init({baseUrl: '/dhis/api'})
 *   .then((d2) => {
 *     console.log(d2.model.dataElement.list());
 *   });
 * ```
 */
export function init(initConfig, ApiClass = Api, logger = Logger.getLogger()) {
    const api = ApiClass.getApi();

    const config = Config.create(preInitConfig, initConfig);

    if (config.headers) {
        api.setDefaultHeaders(config.headers);
    }

    const d2 = {
        models: undefined,
        model,
        Api: ApiClass,
        system: System.getSystem(),
        i18n: I18n.getI18n(),
        dataStore: DataStore.getDataStore(),
    };

    // Process the config in a the config class to keep all config calls together.
    Config.processConfigForD2(config, d2);

    // Because when importing the getInstance method in dependencies the getInstance could run before
    // init we have to resolve the current promise on first run and for consecutive ones replace the
    // old one with a fresh promise.
    if (firstRun) {
        firstRun = false;
    } else {
        deferredD2Init = Deferred.create();
    }

    const modelRequests = getModelRequests(api, config.schemas);

    const userRequests = [
        api.get('me', { fields: ':all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id]' }),
        api.get('me/authorization'),
        getUserSettings(ApiClass),
    ];

    const systemRequests = [
        api.get('system/info'),
        api.get('apps'),
    ];

    return Promise.all([
        ...modelRequests,
        ...userRequests,
        ...systemRequests,
        d2.i18n.load(),
    ])
        .then((res) => {
            const responses = {
                schemas: pick('schemas')(res[0]),
                attributes: pick('attributes')(res[1]),
                currentUser: res[2],
                authorities: res[3],
                userSettings: res[4],
                systemInfo: res[5],
                apps: res[6],
            };

            responses.schemas
                // We only deal with metadata schemas
                .filter(schema => schema.metadata)
                // TODO: Remove this when the schemas endpoint is versioned or shows the correct urls for the requested version
                // The schemas endpoint is not versioned which will result into the modelDefinitions always using the
                // "default" endpoint, we therefore modify the endpoint url based on the given baseUrl.
                .map((schema) => {
                    schema.apiEndpoint = updateAPIUrlWithBaseUrlVersionNumber(schema.apiEndpoint, config.baseUrl); // eslint-disable-line no-param-reassign

                    return schema;
                })
                .forEach((schema) => {
                    // Attributes that do not have values do not by default get returned with the data,
                    // therefore we need to grab the attributes that are attached to this particular schema to be able to know about them
                    const schemaAttributes = responses.attributes
                        .filter((attributeDescriptor) => {
                            const attributeNameFilter = [schema.singular, 'Attribute'].join('');
                            return attributeDescriptor[attributeNameFilter] === true;
                        });

                    if (!Object.prototype.hasOwnProperty.call(d2.models, schema.singular)) {
                        d2.models.add(model.ModelDefinition.createFromSchema(schema, schemaAttributes));
                    }
                });

            d2.currentUser = CurrentUser.create(
                responses.currentUser,
                responses.authorities,
                d2.models,
                responses.userSettings,
            );
            d2.system.setSystemInfo(responses.systemInfo);
            d2.system.setInstalledApps(responses.apps);

            deferredD2Init.resolve(d2);
            return deferredD2Init.promise;
        })
        .catch((error) => {
            logger.error('Unable to get schemas from the api', JSON.stringify(error), error);

            deferredD2Init.reject('Unable to get schemas from the DHIS2 API');
            return deferredD2Init.promise;
        });
}

/**
 * @function getInstance
 *
 * @returns {Promise} A promise to an initialized d2 instance.
 *
 * @description
 * This function can be used to retrieve the `singleton` instance of d2. The instance is being created by calling
 * the `init` method.
 *
 * ```js
 * import {init, getInstance} from 'd2';
 *
 * init({baseUrl: '/dhis2/api/'});
 * getInstance()
 *   .then(d2 => {
 *      d2.models.dataElement.list();
 *      // and all your other d2 magic.
 *   });
 * ```
 */
export function getInstance() {
    return deferredD2Init.promise;
}

// Alias preInitConfig to be able to `import {config} from 'd2';`
/**
 * @property config
 *
 * @description
 * Can be used to set config options before initialisation of d2.
 *
 * ```js
 * import {config, init} from 'd2';
 *
 * config.baseUrl = '/demo/api';
 * config.i18n.sources.add('i18n/systemsettingstranslations.properties');
 *
 * init()
 *   .then(d2 => {
 *     d2.system.settings.all()
 *       .then(systemSettings => Object.keys())
 *       .then(systemSettingsKey => {
 *         d2.i18n.getTranslation(systemSettingsKey);
 *       });
 *   });
 *
 * ```
 */
export const config = preInitConfig;

export default {
    init,
    config,
    getInstance,
    getUserSettings,
    getManifest,
};
