import Api from '../api/Api';
import { isString, isArray } from '../lib/check';

/**
 * @description
 * Represents a namespace in the dataStore that can be used to be used to interact with
 * the remote API.
 *
 * @property {Array} keys an array of the loaded keys.
 * @property {String} namespace Name of the namespace as on the server.
 *
 * @memberof module:datastore
 */
class BaseStoreNamespace {
    constructor(namespace, keys, api = Api.getApi(), endPoint) {
        if (!isString(namespace)) {
            throw new Error('BaseStoreNamespace must be called with a string to identify the Namespace');
        }
        if (!isString(endPoint)) {
            throw new Error('BaseStoreNamespace must be called with an endPoint');
        }

        this.api = api;
        this.namespace = namespace;
        this.keys = keys || [];
        this.endPoint = endPoint;
    }

    /**
     * Get the keys for current namespace.
     *
     * @param forceLoad if true, retrieves and updates internal keys with
     * response from API. Default false
     * @returns {Promise} of the internal list of keys for current namespace.
     */
    getKeys(forceLoad = false) {
        if (!forceLoad) {
            return Promise.resolve(this.keys);
        }

        return this.api.get([this.endPoint, this.namespace].join('/'))
            .then((response) => {
                if (response && isArray(response)) {
                    this.keys = response;
                    return response;
                }
                throw new Error('The requested namespace has no keys or does not exist.');
            });
    }

    /**
     * Retrieves the value of given key in current namespace.
     *
     * @param key to retrieve
     * @returns {Promise} with the value of the key.
     */
    get(key) {
        return this.api.get([this.endPoint, this.namespace, key].join('/'));
    }

    /**
     * Sets the value of given key to given value.
     * This will also create a new namespace on the API-end if it does not exist.
     * If the key exists {@link update} will be called.
     * @param key in namespace to update.
     * @param value to be set
     * @param overrideUpdate - If true a post-request is sent even if key exists.
     * @returns {Promise}
     */
    set(key, value, overrideUpdate = false) {
        if (!overrideUpdate && this.keys.includes(key)) {
            return this.update(key, value);
        }

        return this.api.post([this.endPoint, this.namespace, key].join('/'), value).then((resp) => {
            this.keys = [...this.keys, key];
            return resp;
        });
    }

    /**
     * Deletes given key from the API.
     * @param key to delete.
     */
    delete(key) {
        const ind = this.keys.indexOf(key);
        if (ind > -1) {
            this.keys = [...this.keys.slice(0, ind), ...this.keys.slice(ind + 1)];
        }
        return this.api.delete([this.endPoint, this.namespace, key].join('/'));
    }

    /**
     * Updates a key with given value.
     * @param key to update
     * @param value to update to
     * @returns {Promise} of return value from API-call.
     */
    update(key, value) {
        return this.api.update([this.endPoint, this.namespace, key].join('/'), value);
    }
}

export default BaseStoreNamespace;
