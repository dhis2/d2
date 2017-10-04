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
     * Retrieves a list of keys for the given namespace, and returns an instance of UserDataStoreNamespace that
     * may be used to interact with this namespace. See {@link module:datastore.DataStoreNamespace DataStoreNamespace}.
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
     * before the namespace is created. If false, an instance of the namespace is returned without any keys.
     * @returns {Promise<DataStoreNamespace>} An instance of a UserDataStoreNamespace representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true) {
        return super.get(namespace, autoLoad, DataStoreNamespace);
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
