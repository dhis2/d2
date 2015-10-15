/**
 * @module System
 *
 * @requires lib/check
 * @requires api/Api
 */
import Api from '../api/Api';
import settingsKeyMapping from './settingsKeyMapping';

/**
 * @class SystemConfiguration
 *
 * @description
 * Handles communication with the configuration endpoint. Can be used to get or set configuration options.
 */
// TODO: Return the values from the local cache if we have not updated it? We could
class SystemConfiguration {
    constructor(api = Api.getApi()) {
        this.api = api;

        this._configuration = undefined;
        this._configPromise = null;
    }

    /**
     * @method all
     *
     * @returns {Promise} Promise that resolves with all the individual configuration options from the api.
     *
     * @description
     * Fetches all system configuration settings from the API and caches them so that future calls to this function
     * won't call the API again.
     * ```js
     * d2.system.configuration.all()
     *  .then(configuration => {
     *    console.log(
     *      'Self-registered users will be assigned to the : ' +
     *      configuration.selfRegistrationOrgUnit + ' org unit'
     *    );
     *  });
     * ```
     *
     * @param {boolean} ignoreCache If set to true, calls the API regardless of cache status
     */
    all(ignoreCache) {
        if (this._configPromise === null || ignoreCache === true) {
            this._configPromise = this.api.get('configuration')
                .then(configuration => {
                    this._configuration = configuration;
                    return this._configuration;
                });
        }

        return this._configPromise;
    }

    /**
     * Returns the value of the specified configuration option.
     *
     * This is a convenience method that works exactly the same as calling `configuration.all()[name]`.
     *
     * @param key
     * @param ignoreCache
     * @returns {*|Promise}
     */
    get(key, ignoreCache) {
        return this.all(ignoreCache).then(config => {
            if (config.hasOwnProperty(key)) {
                return Promise.resolve(config[key]);
            }

            return Promise.reject('Unknown config option: ' + key);
        });
    }


    /**
     * Send a query to the API to change the value of a configuration key to the specified value
     *
     * @param key
     * @param value
     * @returns {Promise}
     */
    set(key, value) {
        const that = this;
        let req;

        if (key === 'feedbackRecipients' && value === 'null' || value === null) {
            req = this.api.delete(['configuration', key].join('/'), {dataType: 'text'});
        } else if (key === 'corsWhitelist') {
            req = this.api.post(['configuration', key].join('/'), value.trim().split('\n'), {dataType: 'text'});
        } else {
            const postLoc = settingsKeyMapping.hasOwnProperty(key) &&
                settingsKeyMapping[key].hasOwnProperty('configuration') &&
                settingsKeyMapping[key].configuration;
            if (postLoc) {
                req = this.api.post(['configuration', postLoc, value].join('/'), '', {dataType: 'text'});
            } else {
                return Promise.reject('No configuration found for ' + key);
            }
        }

        return req.then(() => {
            // Ideally we'd update the cache here, but doing so requires another trip to the server
            // For now, just bust the cache to ensure it's not incorrect
            that._configuration = undefined;
            return Promise.resolve();
        });
    }
}

export default SystemConfiguration;
