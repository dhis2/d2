import Api from '../api/Api';
import { isString, isArray } from '../lib/check';

/**
 * @private
 * @description
 * Represents a namespace in the dataStore that can be used to be used to interact with
 * the remote API.
 *
 * @property {Array} keys an array of the loaded keys.
 * @property {String} namespace name of this namespace as on the server.
 *
 * @memberof module:datastore
 */
class BaseStoreNamespace {
    /**
     * @param {string} namespace - the name of the namespace this represents.
     * @param {string[]} keys - preloaded keys for this namespace.
     * @param {module:api.Api} api - the api implementation, used for testing.
     * @param {string} endPoint - the relative API-endpoint, one of ['dataStore, userDataStore'].
     */
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
     * Get the keys for this namespace.
     *
     * @param [forceLoad] - If true, retrieves and updates internal keys with
     * response from API.
     * @returns {Promise} - The internal list of keys for current namespace.
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
     * @param key - key to retrieve.
     * @returns {Promise} - The value of the given key.
     */
    get(key) {
        return this.api.get([this.endPoint, this.namespace, key].join('/'));
    }

    /**
     * Sets the value of given key to given value.
     *
     * This will also create a new namespace on the API-end if it does not exist.
     * If the key exists {@link #update update} will be called.
     *
     * @param key - key in this namespace to update.
     * @param value - value to be set.
     * @param [overrideUpdate=false] - If true a post-request is sent even if key exists.
     * @returns {Promise} - the response body from the {@link module:api.Api#get API}.
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
     * @param {string} key - key to delete.
     * @returns {Promise} - the response body from the {@link module:api.Api#get API}.
     */
    delete(key) {
        return this.api.delete([this.endPoint, this.namespace, key].join('/')).then((resp) => {
            this.keys = this.keys.filter(elem => elem !== key);
            return resp;
        });
    }

    /**
     * Updates a key with given value.
     * @param key - key to update.
     * @param value - value to update to.
     * @returns {Promise} - the response body from the {@link module:api.Api#get API}.
     */
    update(key, value) {
        return this.api.update([this.endPoint, this.namespace, key].join('/'), value);
    }
}

export default BaseStoreNamespace;
