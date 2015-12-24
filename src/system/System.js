/**
 * @module System
 *
 * @requires d2/system/SystemSettings
 */

import Api from '../api/Api';
import SystemSettings from './SystemSettings';
import SystemConfiguration from './SystemConfiguration';

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

        this.systemInfo = undefined;

        this.installedApps = undefined;
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
                    if (val.options.hasOwnProperty(opt) && isNaN(val.options[opt])) {
                        strings.add(val.options[opt]);
                    }
                }
            }
        });
        return strings;
    }


    // TODO: Document
    setSystemInfo(systemInfo) {
        this.version = System.parseVersionString(systemInfo.version);
        this.systemInfo = systemInfo;
    }

    // TODO: Document
    setInstalledApps(apps) {
        this.installedApps = apps;
    }

    reloadInstalledApps() {
        const api = Api.getApi();
        return new Promise((resolve) => {
            api.get('apps').then(apps => {
                this.setInstalledApps(apps);
                resolve(apps);
            });
        });
    }

    // TODO: Document
    // TODO: Upload progress
    uploadApp(zipFile) {
        const data = new FormData();
        data.append('file', zipFile);

        const api = Api.getApi();
        return api.post('apps', data, {
            contentType: false,
            processData: false,
        });
    }

    // TODO: Document
    loadAppStore(compatibleOnly = true) {
        return new Promise((resolve, reject) => {
            const api = Api.getApi();
            api.get('appStore').then(appStore => {
                appStore.apps = appStore.apps.filter(app => {
                    if (compatibleOnly) {
                        app.versions = app.versions.filter(appVersion => System.isVersionCompatible(this.version, appVersion));
                    }
                    return app.versions.length > 0;
                });
                resolve(appStore);
            }).catch(err => {
                reject(err);
            });
        });
    }

    // TODO: Document
    installApp(uid) {
        const api = Api.getApi();
        return new Promise((resolve) => {
            api.post(['appStore', uid].join('/')).catch(() => {
                resolve();
            });
        });
    }

    // TODO: Document
    uninstallApp(appKey) {
        const api = Api.getApi();
        return new Promise((resolve) => {
            api.delete(['apps', appKey].join('/'))
                // TODO: Stop jQuery from rejecting successful promises
                .catch(() => { resolve(); });
        });
    }

    // TODO: Document
    refreshApp(appKey) {
        const api = Api.getApi();
        return api.update(['apps', appKey].join('/'));
    }

    // TODO: Document
    // TODO: Validate string
    // TODO: Handle valid version objects too
    static parseVersionString(version) {
        return {
            major: Number.parseInt(version, 10),
            minor: Number.parseInt(version.substring(version.indexOf('.') + 1), 10),
            snapshot: version.indexOf('-SNAPSHOT') >= 0,
        };
    }

    // TODO: Document
    static compareVersions(a, b) {
        const from = (typeof a === 'string' || a instanceof String) ? System.parseVersionString(a) : a;
        const to = (typeof b === 'string' || b instanceof String) ? System.parseVersionString(b) : b;

        if (from.major !== to.major) {
            return from.major - to.major;
        } else if (from.minor !== to.minor) {
            return from.minor - to.minor;
        }

        return (from.snapshot ? 0 : 1) - (to.snapshot ? 0 : 1);
    }


    static isVersionCompatible(systemVersion, appVersion) {
        const isNewEnough = appVersion.min_platform_version ? System.compareVersions(systemVersion, appVersion.min_platform_version) >= 0 : true;
        const isNotTooOld = appVersion.max_platform_version ? System.compareVersions(systemVersion, appVersion.max_platform_version) <= 0 : true;

        return isNewEnough && isNotTooOld;
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
        return new System(new SystemSettings(), new SystemConfiguration());
    }
}

export default System;
