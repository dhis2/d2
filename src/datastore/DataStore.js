import { isString, isArray } from '../lib/check';
import DataStoreNamespace from './DataStoreNamespace';
import Api from '../api/Api';

/**
 * @class DataStore
 *
 * @description
 * Represents the dataStore that can be interacted with. This can be used to get instances of DataStoreNamespace, which
 * can be used to interact with the namespace API.
 *
 * Example usage:
 * ```js
 * import init from 'd2';
 * import { dataStore } from 'DataStore';
 * init({baseUrl: '/dhis/api'})
 *   .then((d2) => {
 *     dataStore.open('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
 * ```
 */

class DataStore {
    constructor(api = Api.getApi()) {
        this.endPoint = 'dataStore';

        this.api = api;
    }

    /**
     * Retrieves a list of keys for the given namespace, and returns an instance of DataStoreNamespace that
     * may be used to interact with this namespace. See {@link DataStoreNamespace}.
     * @param namespace to open.
     * @param autoLoad if true, autoloads the keys of the namespace before the namespace. If false, an instance of
     * the namespace is returned. Default true
     * namespace.refresh() can then be used to load keys on demand.
     * @returns {Promise<DataStoreNamespace>} An instance of a DataStoreNamespace representing the namespace that can be interacted with.
     */
    open(namespace, autoLoad = true) {
        if (!isString(namespace)) {
            throw new TypeError('A "namespace" parameter should be specified when calling open() on dataStore');
        }

        if (!autoLoad) {
            return new Promise((resolve) => {
                resolve(new DataStoreNamespace(namespace));
            });
        }

        return this.api.get([this.endPoint, namespace].join('/'))
                    .then((response) => {
                        if (response && isArray(response)) {
                            return new DataStoreNamespace(namespace, response);
                        }
                        return new Error('The requested namespace has no keys or does not exist.');
                    }).catch((e) => {
                        if (e.httpStatusCode === 404) {
                            // If namespace does not exist, provide an instance of DataStoreNamespace
                            // so it's possible to interact with the namespace.
                            return new DataStoreNamespace(namespace);
                        }
                        throw e;
                    });
    }


    /**
     * Retrieves a list of all public namespaces on the server.
     * @returns {Promise} with an array of namespaces.
     */
    getNamespaces() {
        return this.api.get([this.endPoint])
            .then((response) => {
                if (response && isArray(response)) {
                    return response;
                }
                return new Error('No namespaces exist.');
            });
    }

    /**
     * Deletes a namespace
     * @param namespace to delete
     * @returns {Promise} with the response from the API.
     */
    delete(namespace) {
        return this.api.delete([this.endPoint, namespace].join('/'));
    }

}

export const dataStore = (() =>
    new DataStore())();

export default DataStore;
