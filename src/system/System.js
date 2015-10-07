/**
 * @module System
 *
 * @requires d2/system/SystemSettings
 */

import SystemSettings from 'd2/system/SystemSettings';
import SystemConfiguration from 'd2/system/SystemConfiguration';

/**
 * @class System
 *
 * @description
 * Represents the system that can be interacted with. There is a single instance of this pre-defined onto the d2
 * object after initialisation. This can be interacted with using its property objects to among other be used
 * to get and save systemSettings.
 */
class System {
    constructor(settings, configuration) {
        /**
         * @property {SystemSettings} settings Contains a reference to a `SystemSettings` instance that can be used
         * to retrieve and save system settings.
         *
         * @description
         * ```js
         * d2.system.settings.get('keyLastSuccessfulResourceTablesUpdate')
         *  .then(systemSettingsValue => {
         *    console.log('Analytics was last updated on: ' + systemSettingsValue);
         *  });
         * ```
         */
        this.settings = settings;

        /**
         * @property {SystemConfiguration} configuration
         *
         * @description A representation of the system configuration, that can be used to retreive and change system
         * configuration options.
         */
        this.configuration = configuration;
    }

    /**
     * Retrieves the complete list of translatable strings relating to system settings and system configuration
     *
     * @returns {Set} A set of translatable strings
     */
    getI18nStrings() {
        const strings = new Set();
        Object.keys(this.settings.mapping).map(key => {
            const val = this.settings.mapping[key];
            if (val.hasOwnProperty('label')) {
                strings.add(val.label);
            }
            if (val.hasOwnProperty('description')) {
                strings.add(val.description);
            }
            if (val.hasOwnProperty('options')) {
                for (const opt in val.options) {
                    if (val.options.hasOwnProperty(opt) && !isNaN(val.options[opt])) {
                        strings.add(val.options[opt]);
                    }
                }
            }
        });
        return strings;
    }

    /**
     * @method getSystem
     * @static
     *
     * @returns {System} Object with the system interaction properties
     *
     * @description
     * Get a new instance of the system object.
     */
    static getSystem() {
        return new System(new SystemSettings(), new SystemConfiguration);
    }
}

export default System;
