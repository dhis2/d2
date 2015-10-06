import {pick, Deferred} from 'd2/lib/utils';
import Logger from 'd2/logger/Logger';
import model from 'd2/model/models';
import Api from 'd2/api/Api';
import System from 'd2/system/System';
import I18n from 'd2/i18n/I18n';
import Config from 'd2/config';
import CurrentUser from 'd2/current-user/CurrentUser';
import jQuery from 'd2/external/jquery';

let firstRun = true;
let deferredD2Init = Deferred.create();

const preInitConfig = Config.create();

export function getManifest(url) {
    const api = new Api(jQuery);
    api.setBaseUrl('./');

    const manifestUtilities = {
        getBaseUrl() {
            return this.activities.dhis.href;
        },
    };

    return api.get(`${url}`)
        .then(manifest => {
            return Object.assign({}, manifest, manifestUtilities);
        });
}

export function getUserLocale() {
    const api = Api.getApi();

    if (getUserLocale.cachedResponse) {
        return getUserLocale.cachedResponse;
    }

    // Cache the Locale response so we don't request it again.
    getUserLocale.cachedResponse = api.get('userSettings/keyUiLocale', {}, {dataType: 'text'})
        // Set the default language to english when a 404 is returned
        .catch(() => {
            return 'en';
        });

    return getUserLocale.cachedResponse;
}

/**
 * @function getUserSettings
 *
 * @returns {Promise} A promise to the current user settings
 *
 * @description
 * The object that is the result of the promise will have the following properties
 * ```json
 * {
 *   "uiLocale": "en" // The users locale, that can be used for translations)
 * }
 * ```
 */
export function getUserSettings() {
    const api = Api.getApi();

    if (preInitConfig.baseUrl) {
        api.setBaseUrl(preInitConfig.baseUrl);
    }

    return Promise.all([getUserLocale()])
        .then(([uiLocale]) => {
            return {
                uiLocale,
            };
        });
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
export function init(initConfig) {
    const api = Api.getApi();
    const logger = Logger.getLogger();

    const config = Config.create(preInitConfig, initConfig);

    const d2 = {
        models: undefined,
        model: model,
        Api: Api,
        system: System.getSystem(),
        i18n: I18n.getI18n(),
    };

    // Process the config in a the config class to keep all config calls together.
    Config.processConfigForD2(config, d2);

    // Because when importing the getInstance method in dependencies the getInstance could run before
    // init we have to resolve the current promise on first run and for consecurtive ones replace the
    // old one with a fresh promise.
    if (firstRun) {
        firstRun = false;
    } else {
        deferredD2Init = Deferred.create();
    }

    return Promise.all([
        api.get('schemas'),
        api.get('attributes', {fields: ':all,optionSet[:all]', paging: false}),
        api.get('me', {fields: ':all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id]'}),
        api.get('me/authorization'),
        getUserLocale(),
        d2.i18n.load(),
    ])
        .then(responses => {
            return {
                schemas: pick('schemas')(responses[0]),
                attributes: pick('attributes')(responses[1]),
                currentUser: responses[2],
                authorities: responses[3],
                uiLocale: responses[4],
            };
        })
        .then((responses) => {
            responses.schemas.forEach((schema) => {
                // Attributes that do not have values do not by default get returned with the data.
                // Therefore we need to grab the attributes that are attached to this particular schema to be able to know about them
                const schemaAttributes = responses.attributes
                    .filter(attributeDescriptor => {
                        const attributeNameFilter = [schema.name, 'Attribute'].join('');
                        return attributeDescriptor[attributeNameFilter] === true;
                    });

                d2.models.add(model.ModelDefinition.createFromSchema(schema, schemaAttributes));
            });

            d2.currentUser = CurrentUser.create(responses.currentUser, responses.authorities, d2.models);
            d2.currentUser.userSettings = {
                keyUiLocale: responses.uiLocale,
            };

            deferredD2Init.resolve(d2);
            return deferredD2Init.promise;
        })
        .catch((error) => {
            logger.error('Unable to get schemas from the api', error);

            return Promise.reject(error);
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
