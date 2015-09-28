/**
 * @module System
 *
 * @requires lib/check
 * @requires api/Api
 */
import Api from 'd2/api/Api';

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

        this.configuration = undefined;
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
        if (this.configuration && ignoreCache !== true) {
            return Promise.resolve(this.configuration);
        }
        const that = this;

        return Promise.all([
            this.api.get(['configuration', 'systemId'].join('/')),
            this.api.get(['configuration', 'feedbackRecipients'].join('/')),
            this.api.get(['configuration', 'offlineOrganisationUnitLevel'].join('/')),
            this.api.get(['configuration', 'infrastructuralIndicators'].join('/')),
            this.api.get(['configuration', 'infrastructuralDataElements'].join('/')),
            this.api.get(['configuration', 'infrastructuralPeriodType'].join('/')),
            this.api.get(['configuration', 'selfRegistrationRole'].join('/')),
            this.api.get(['configuration', 'selfRegistrationOrgUnit'].join('/')),
        ]).then(config => {
            that.configuration = {
                systemId: config[0],
                feedbackRecipients: config[1],
                offlineOrganisationUnitLevel: config[2],
                infrastructuralIndicators: config[3],
                infrastructuralDataElements: config[4],
                infrastructuralPeriodType: config[5],
                selfRegistrationRole: config[6],
                selfRegistrationOrgUnit: config[7],
            };
            return Promise.resolve(that.configuration);
        });
    }

    /**
     * Returns the value of the specified configuration option.
     *
     * This is a convenience method that works exactly the same as calling `configuration.all()[name]`.
     *
     * @param name
     * @param ignoreCache
     * @returns {*|Promise}
     */
    get(name, ignoreCache) {
        return this.all(ignoreCache).then(config => {
            if (config.hasOwnProperty(name)) {
                return config[name];
            }

            throw new Error('Unknown config option: ' + name);
        });
    }
}

export default SystemConfiguration;
