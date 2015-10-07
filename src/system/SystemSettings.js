/**
 * @module System
 *
 * @requires lib/check
 * @requires api/Api
 */

import {isString} from 'd2/lib/check';
import Api from 'd2/api/Api';

import settingsKeyMapping from 'd2/system/settingsKeyMapping';

/**
 * @class SystemSettings
 *
 * @description
 * Handles communication with the systemSettings endpoint. Can be used to get or save systemSettings.
 */
// TODO: Return the values from the local cache if we have not updated it? We could
class SystemSettings {
    constructor(api = Api.getApi()) {
        this.api = api;

        this.mapping = settingsKeyMapping;
    }

    /**
     * @method all
     *
     * @returns {Promise} Promise that resolves with the systemsettings object from the api.
     *
     * @description
     * Loads all the system settings in the system and returns them as an object from the promise.
     * ```js
     * d2.system.settings.all()
     *  .then(systemSettings => {
     *    console.log('Analytics was last updated on: ' + systemSettings.keyLastSuccessfulResourceTablesUpdate);
     *  });
     * ```
     */
    all() {
        return this.api.get('systemSettings');
    }

    /**
     * @method get
     *
     * @param {String} systemSettingsKey The identifier of the system setting that should be retrieved.
     * @returns {Promise} A promise that resolves with the value or will fail if the value is not available.
     *
     * @description
     * ```js
     * d2.system.settings.get('keyLastSuccessfulResourceTablesUpdate')
     *  .then(systemSettingsValue => {
     *    console.log('Analytics was last updated on: ' + systemSettingsValue);
     *  });
     * ```
     */
    get(systemSettingsKey) {
        function processValue(value) {
            // Attempt to parse the response as JSON. If this fails we return the value as is.
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
            return value;
        }

        return new Promise((resolve, reject) => {
            if (!isString(systemSettingsKey)) {
                throw new TypeError('A "key" parameter should be specified when calling get() on systemSettings');
            }

            this.api.get(['systemSettings', systemSettingsKey].join('/'), undefined, {dataType: 'text'})
                .then(response => {
                    const systemSettingValue = processValue(response);
                    if (systemSettingValue) {
                        resolve(processValue(response));
                    }
                    reject(new Error('The requested systemSetting has no value or does not exist.'));
                });
        });
    }

    set(systemSettingsKey, value) {
        return new Promise((resolve, reject) => {
            const settingUrl = ['systemSettings', systemSettingsKey].join('/');
            return this.api.post(settingUrl, value, {dataType: 'text', contentType: 'text/plain'})
                .then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
        });
    }
}

export default SystemSettings;
