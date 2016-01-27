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


        /**
         * @property {Object} systemInfo
         *
         * @description An object containing system information about the DHIS2 instance
         */
        this.systemInfo = undefined;


        /**
         * @property {Object} version
         *
         * @description An object containing version information about the DHIS2 instance
         */
        this.version = undefined;


        /**
         * @property {Array} installedApps
         *
         * @description An array of all the webapps that are installed on the current DHIS2 instance
         */
        this.installedApps = undefined;
    }


    /**
     * Sets the systemInfo and version properties
     *
     * @param systemInfo
     */
    setSystemInfo(systemInfo) {
        this.version = System.parseVersionString(systemInfo.version);
        this.systemInfo = systemInfo;
    }


    /**
     * Sets the list of currently installed webapps
     *
     * @param apps
     */
    setInstalledApps(apps) {
        this.installedApps = apps;
    }


    /**
     * Refreshes the list of currently installed webapps
     *
     * @returns {Promise} A promise that resolves to the list of installed apps
     */
    loadInstalledApps() {
        const api = Api.getApi();

        return api.get('apps')
            .then(apps => {
                this.setInstalledApps(apps);

                return apps;
            });
    }


    /**
     * Upload and install a zip file containing a new webapp
     *
     * @param zipFile Zip file data from a file input form field
     * @param onProgress An optional callback that will be called whenever file upload progress info is available
     * @returns {Promise}
     */
    uploadApp(zipFile, onProgress) {
        const api = Api.getApi();
        const data = new FormData();
        let xhr = undefined;
        data.append('file', zipFile);

        if (onProgress !== undefined) {
            xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (progress) => {
                if (progress.lengthComputable) {
                    onProgress(progress.loaded / progress.total);
                }
            };
        }

        return api.post('apps', data, {
            contentType: false,
            processData: false,
            xhr: xhr !== undefined ? () => xhr : undefined,
        });
    }


    /**
     * Load the list of apps available in the DHIS 2 app store
     *
     * @param compatibleOnly If true, apps that are incompatible with the current system will be filtered out
     * @returns {Promise}
     */
    loadAppStore(compatibleOnly = true) {
        return new Promise((resolve, reject) => {
            const api = Api.getApi();
            api.get('appStore').then(appStoreData => {
                const appStore = Object.assign({}, appStoreData);

                appStore.apps = appStore.apps
                    .map(appData => {
                        const app = Object.assign({}, appData);

                        if (compatibleOnly) {
                            app.versions = app.versions
                                .filter(versionData => System.isVersionCompatible(this.version, versionData));
                        }

                        return app;
                    })
                    .filter(appData => appData.versions.length > 0);

                resolve(appStore);
            }).catch(err => {
                reject(err);
            });
        });
    }


    /**
     * Install the specified app version from the DHIS 2 app store
     *
     * @param uid The uid of the app version to install
     * @returns {Promise}
     */
    installAppVersion(uid) {
        const api = Api.getApi();
        return new Promise((resolve, reject) => {
            api.post(['appStore', uid].join('/'), '', { dataType: 'text' }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }


    /**
     * Remove the specified app from the system
     *
     * @param appKey The key of the app to remove
     * @returns {Promise}
     */
    uninstallApp(appKey) {
        const api = Api.getApi();

        return api.delete(['apps', appKey].join('/'))
            // TODO: Stop jQuery from rejecting successful promises
            .catch(() => undefined);
    }


    /**
     * Refresh the list of apps that are installed on the server
     *
     * @returns {Promise} A promise that resolves to the updated list of installed apps
     */
    reloadApps() {
        const api = Api.getApi();
        return api.update('apps').then(() => this.loadInstalledApps());
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
    // Disable eslint complexity warning
    /* eslint-disable */
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
    /* eslint-enable */


    static isVersionCompatible(systemVersion, appVersion) {
        const isNewEnough = (
            appVersion.min_platform_version ?
            System.compareVersions(systemVersion, appVersion.min_platform_version) >= 0 :
            true
        );
        const isNotTooOld = (
            appVersion.max_platform_version ?
            System.compareVersions(systemVersion, appVersion.max_platform_version) <= 0 :
            true
        );

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
