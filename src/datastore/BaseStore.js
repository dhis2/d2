/**
 * @module datastore
 */

import { isArray } from '../lib/check';
import Api from '../api/Api';

/**
 * @private
 * @description
 * Represents a key-value store that can be interacted with. This can be used to get instances of Namespaces, which
 * can be used to interact with the relating namespace API.
 *
 * @memberof module:datastore
 * @abstract
 */
class BaseStore {
    constructor(api = Api.getApi(), endPoint = 'dataStore') {
        this.endPoint = endPoint;
        this.api = api;
    }

    /**
     * @description
     * Retrieves a list of keys for the given namespace, and returns an instance of UserDataStoreNamespace that
     * may be used to interact with this namespace. See {@link DataStoreNamespace}.
     *
     * @param namespace to get.
     * @param [autoLoad=true] If true, autoloads the keys of the namespace from the server.
     * before the namespace is created. If false, an instance of he namespace is returned without any keys.
     * @returns {Promise<BaseStoreNamespace>} An instance of a current store-Namespace-instance representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true, RetClass) { // eslint-disable-line no-unused-vars, class-methods-use-this
        if (!autoLoad) {
            return new Promise((resolve) => {
                resolve(new RetClass(namespace));
            });
        }

        return this.api.get([this.endPoint, namespace].join('/'))
            .then((response) => {
                if (response && isArray(response)) {
                    if (response.length < 1) { // fix for api bug returning empty array instead of 404
                        return Promise.reject(response);
                    }
                    return new RetClass(namespace, response);
                }
                throw new Error('The requested namespace has no keys or does not exist.');
            }).catch((e) => {
                if (e.httpStatusCode === 404 || (isArray(e) && e.length < 1)) {
                    // If namespace does not exist, provide an instance of UserDataStoreNamespace
                    // so it's possible to interact with the namespace.
                    return new RetClass(namespace);
                }
                throw e;
            });
    }

    /**
     * Retrieves a list of all namespaces on the server.
     * @returns {Promise} An array of namespaces.
     */
    getAll() {
        return this.api.get(this.endPoint)
            .then((response) => {
                if (response && isArray(response)) {
                    return response;
                }
                throw new Error('No namespaces exist.');
            });
    }

    /**
     * Deletes a namespace
     *
     * @param {string} namespace The namespace to delete.
     * @returns {Promise} the response body from the {@link module:api.Api#get API}.
     */
    delete(namespace) {
        return this.api.delete([this.endPoint, namespace].join('/'));
    }
}

export default BaseStore;
