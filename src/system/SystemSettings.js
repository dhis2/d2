'use strict';
/**
 * @module System
 *
 * @requires lib/check
 * @requires api/Api
 */

import {isString} from 'd2/lib/check';
import Api from 'd2/api/Api';

/**
 * @class SystemSettings
 *
 * @description
 * Handles communication with the systemSettings endpoint. Can be used to get or save systemSettings.
 */
class SystemSettings {
    constructor(api = Api.getApi()) {
        this.api = api;
    }

    all() {

    }

    /**
     * @method get
     *
     * @param {String} systemSettingsKey The identifier of the system setting that should be retrieved.
     * @returns {Promise} A promise that resolves with the value or will fail if the value is not available.
     *
     * @description
     */
    // TODO: Return the value from the local cache if we have not updated it?
    get(systemSettingsKey) {
        return new Promise((resolve, reject) => {
            if (!isString(systemSettingsKey)) {
                throw new TypeError('A "key" parameter should be specified when calling get() on systemSettings');
            }

            this.api.get(['systemSettings', systemSettingsKey].join('/'), undefined, {dataType: 'text'})
                .then(response => {
                    let systemSettingValue = processValue(response);
                    if (systemSettingValue) {
                        resolve(processValue(response));
                    }
                    reject(new Error('The requested systemSetting has no value or does not exist.'));
                });
        });

        function processValue(value) {
            //Attempt to parse the response as JSON. If this fails we return the value as is.
            try {
                return JSON.parse(value);
            }
            catch (e) {}
            return value;
        }
    }
}

export default SystemSettings;
