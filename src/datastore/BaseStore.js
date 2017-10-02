/**
 * @module datastore
 */

import { isArray } from '../lib/check';
import Api from '../api/Api';

/**
 * @description
 * Represents a datastore that can be interacted with. This can be used to get instances of UserDataStoreNamespace, which
 * can be used to interact with the namespace API.
 *
 * @example
 * import init from 'd2';
 *
 * init({baseUrl: '/dhis/api'})
 *   .then((d2) => {
 *     d2.dataStore.get('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
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
     * @abstract
     * @description
     * Retrieves a list of keys for the given namespace, and returns an instance of UserDataStoreNamespace that
     * may be used to interact with this namespace. See {@link DataStoreNamespace}.
     *
     * Note that a namespace cannot exist without at least one key-value pair, for this reason
     * there is no 'create'- method. It is therefore advised to call this method with autoLoad = false
     * if you are creating a namespace (or you will get a 404-error in the console, as it
     * tries to load a namespace that does not exist).
     *
     * @example <caption>Creation of namespace</caption>
     * d2.dataStore.get('new namespace', false).then(namespace => {
     *     namespace.set('new key', value);
     *
     * @param namespace to get.
     * @param autoLoad if true, autoloads the keys of the namespace from the server
     * before the namespace is created. If false, an instance of he namespace is returned without any keys.
     *  Default true
     * @returns {Promise<DataStoreNamespace>} An instance of a UserDataStoreNamespace representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true) { // eslint-disable-line no-unused-vars, class-methods-use-this
        throw new Error('Must be implemented by subclass.');
    }


    /**
     * Retrieves a list of all namespaces on the server.
     * @returns {Promise} with an array of namespaces.
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
     * @param {string} namespace The namespace to delete
     * @returns {Promise} the response body from the {@link module:api.Api#get API}.
     */
    delete(namespace) {
        return this.api.delete([this.endPoint, namespace].join('/'));
    }
}

export default BaseStore;
