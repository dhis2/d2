'use strict';
/**
 * @module System
 *
 * @requires d2/system/SystemSettings
 */

import SystemSettings from 'd2/system/SystemSettings';

/**
 * @class System
 *
 * @description
 * Represents the system that can be interacted with. There is a single instance of this pre-defined onto the d2
 * object after initialisation. This can be interacted with using its property objects to among other be used
 * to get and save systemSettings.
 */
class System {
    constructor(settings) {
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
        return new System(new SystemSettings());
    }
}

export default System;
