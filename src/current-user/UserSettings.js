import Api from '../api/Api';
import { isString } from '../lib/check';


/**
 * @class UserSettings
 *
 * @description
 * Handles communication with the userSettings endpoint. Can be used to get or save userSettings.
 */

class UserSettings {
    constructor(api = Api.getApi()) {
        this.api = api;
    }

    /**
     * @method all
     *
     * @returns {Promise} Promise that resolves with the usersettings object from the api.
     *
     * @description
     * Loads all the user settings of current user and returns them as an object from the promise.
     * ```js
     * d2.currentUser.userSettings.all()
     *  .then(userSettings => {
     *    console.log('UI Locale: ' + userSettings.keyUiLocale);
     *  });
     * ```
     */
    all() {
        return this.api.get('userSettings');
    }

    /**
     * @method get
     *
     * @param {String} userSettingsKey The identifier of the user setting that should be retrieved.
     * @returns {Promise} A promise that resolves with the value or will fail if the value is not available.
     *
     * @description
     * ```js
     * d2.currentUser.userSettings.get('keyUiLocale')
     *  .then(userSettingValue => {
     *    console.log('UI Locale: ' + userSettingValue);
     *  });
     * ```
     */
    get(userSettingsKey) {
        function processValue(value) {
            // Attempt to parse the response as JSON. If this fails we return the value as is.
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }

        return new Promise((resolve, reject) => {
            if (!isString(userSettingsKey)) {
                throw new TypeError('A "key" parameter should be specified when calling get() on systemSettings');
            }

            this.api.get(['userSettings', userSettingsKey].join('/'), undefined, { dataType: 'text' })
                .then(response => {
                    const userSettingValue = processValue(response);
                    if (userSettingValue) {
                        resolve(processValue(response));
                    }
                    reject(new Error('The requested userSetting has no value or does not exist.'));
                });
        });
    }
}

export default UserSettings;
