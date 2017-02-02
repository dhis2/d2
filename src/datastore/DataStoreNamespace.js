import Api from '../api/Api';
import { isString, isArray } from '../lib/check';

class DataStoreNamespace {

    constructor(namespace, keys, api = Api.getApi()) {
        if (!isString(namespace)) {
            throw new Error('DataStoreNamespaces must be called with a string to identify the Namespace');
        }
        this.api = api;

        this.namespace = namespace;
        this.keys = keys || [];
        this.endPoint = 'dataStore';
    }

    /**
     *
     * @returns {Array} of the internal list of keys for current namespace.
     */
    getKeys() {
        return this.keys;
    }

    /**
     * Retrieves the value of given key in current namespace.
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
        return this.api.post([this.endPoint, this.namespace, key].join('/'), value);
    }

    /**
     * Deletes given key from the API.
     * @param key to delete.
     */
    delete(key) {
        return this.api.delete([this.endPoint, this.namespace, key].join('/'));
    }

    /**
     * Updates a key with given value.
     * @param key to update
     * @param value to update to
     * @returns {Promise}
     */
    update(key, value) {
        return this.api.update([this.endPoint, this.namespace, key].join('/'), value);
    }

    /**
     * Refreshes the internal list of keys.
     * Useful if the state of the API and the current instance
     * have diverged.
     * @returns {Promise} with the response array.
     */
    refresh() {
        return this.api.get([this.endPoint, this.namespace].join('/'))
            .then((response) => {
                if (response && isArray(response)) {
                    this.keys = response;
                    return response;
                }
                return new Error('The requested namespace has no keys or does not exist.');
            });
    }

}

export default DataStoreNamespace;
