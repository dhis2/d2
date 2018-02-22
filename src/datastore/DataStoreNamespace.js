import Api from '../api/Api';
import BaseStoreNamespace from './BaseStoreNamespace';

/**
 * @augments module:datastore.BaseStoreNamespace
 * @description
 * Represents a namespace in the dataStore that can be used to be used to interact with
 * the remote API.
 *
 * @property {array} keys an array of the loaded keys.
 * @property {string} namespace Name of the namespace as on the server.
 * @memberof module:datastore
 */
class DataStoreNamespace extends BaseStoreNamespace {
    constructor(namespace, keys, api = Api.getApi(), endPoint = 'dataStore') {
        super(namespace, keys, api, endPoint);
    }

    /**
     * Retrieves metaData of given key in current namespace.
     *
     * @param key - the key to retrieve metaData for.
     */
    getMetaData(key) {
        return this.api.get(
            [this.endPoint, this.namespace, key, 'metaData'].join('/'),
        );
    }
}

export default DataStoreNamespace;
