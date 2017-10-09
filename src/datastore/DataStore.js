import BaseStore from './BaseStore';
import DataStoreNamespace from './DataStoreNamespace';
import Api from '../api/Api';

/**
 * @augments module:datastore.BaseStore
 * @description
 * Represents the dataStore that can be interacted with. This can be used to get instances of UserDataStoreNamespace, which
 * can be used to interact with the {@link module:datastore.DataStoreNamespace namespace API}.
 *
 * @example
 * import { init } from 'd2';
 *
 * init({baseUrl: 'https://play.dhis2.org/demo/api'})
 *   .then((d2) => {
 *     d2.dataStore.get('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
 *
 * @memberof module:datastore
 */
class DataStore extends BaseStore {
    constructor(api = Api.getApi(), endPoint = 'dataStore') {
        super(api, endPoint, api, endPoint);
    }

    /**
     * @description
     * Tries to get the given namespace from the server, and returns an instance of DataStore that
     * may be used to interact with this namespace. See {@link module:datastore.DataStoreNamespace DataStoreNamespace}.
     *
     * @example <caption>Getting a namespace</caption>
     * d2.dataStore.get('namespace').then(namespace => {
     *     namespace.set('new key', value);
     *});
     * @param namespace - Namespace to get.
     * @param [autoLoad=true] If true, autoloads the keys of the namespace from the server.
     * If false, an instance of the namespace is returned without any keys (no request is sent to the server).
     * @returns {Promise<DataStoreNamespace>} An instance of a DataStoreNamespace representing the namespace that can be interacted with,
     * or an error if namespace exists.
     */
    get(namespace, autoLoad = true, RetClass = DataStoreNamespace) {
        return super.get(namespace, autoLoad, RetClass);
    }

    /**
     * Creates a namespace. Ensures that the namespace does not exists on the server.
     * Note that for the namespace to be saved on the server, you need to call {@link module:datastore.DataStoreNamespace#set set}.
     *
     * @example <caption>Creating a namespace</caption>
     * d2.dataStore.create('new namespace').then(namespace => {
     *     namespace.set('new key', value);
     * });
     * @param {string} namespace The namespace to create.
     * @returns {Promise<DataStoreNamespace>} An instance of the current store-Namespace-instance representing the namespace that can be interacted with, or
     * an error if namespace exists.
     */
    create(namespace, RetClass = DataStoreNamespace) {
        return super.create(namespace, RetClass);
    }

    /**
     * @static
     *
     * @returns {DataStore} Object with the dataStore interaction properties
     *
     * @description
     * Get a new instance of the dataStore object. This will function as a singleton, when a BaseStore object has been created
     * when requesting getDataStore again the original version will be returned.
     */
    static getDataStore() {
        if (!DataStore.getDataStore.dataStore) {
            DataStore.getDataStore.dataStore = new DataStore();
        }

        return DataStore.getDataStore.dataStore;
    }
}

export default DataStore;
