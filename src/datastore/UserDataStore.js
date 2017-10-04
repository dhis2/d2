import { isArray } from '../lib/check';
import BaseStore from './BaseStore';
import UserDataStoreNamespace from './UserDataStoreNamespace';
import Api from '../api/Api';

/**
 * @augments module:datastore.BaseStore
 * @description
 * Represents the UserDataStore that can be interacted with. This can be used to get instances of UserDataStoreNamespace, which
 * can be used to interact with the {@link module:datastore.UserDataStoreNamespace namespace API}.
 *
 * The store is a key-value store, where a namespace contains a list of keys, and
 * a key corresponds to an arbitrary JSON-object.
 *
 * @example
 * import { init } from 'd2';
 *
 * init({baseUrl: '/dhis/api'})
 *   .then((d2) => {
 *     d2.userDataStore.get('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
 *
 * @memberof module:datastore
 */
class UserDataStore extends BaseStore {
    constructor(api = Api.getApi(), endPoint = 'dataStore') {
        super(api, endPoint);
    }

    /**
     * @description
     * Retrieves a list of keys for the given namespace, and returns an instance of UserDataStoreNamespace that
     * may be used to interact with this namespace. See {@link module:datastore.UserDataStoreNamespace UserDataStoreNamespace}.
     *
     * Note that a namespace cannot exist without at least one key-value pair, for this reason
     * there is no 'create'- method. It is therefore advised to call this method with autoLoad = false
     * if you are creating a namespace (or you will get a 404-error in the console, as it
     * tries to load a namespace that does not exist).
     *
     * @example <caption>Creation of namespace</caption>
     * const namespace = await d2.userDataStore.get('new namespace', false);
     * await namespace.set('new key', value);
     *
     * @param {string} namespace - Namespace to get.
     * @param {boolean=} [autoLoad=true] - If true, autoloads the keys of the namespace from the server
     * before the namespace is created. If false, an instance of he namespace is returned without any keys.
     *
     *
     * @returns {Promise<UserDataStoreNamespace>} An instance of a UserDataStoreNamespace representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true) {
        if (!autoLoad) {
            return new Promise((resolve) => {
                resolve(new UserDataStoreNamespace(namespace, null, this.api, this.endPoint));
            });
        }

        return this.api.get([this.endPoint, namespace].join('/'))
            .then((response) => {
                if (response && isArray(response)) {
                    return new UserDataStoreNamespace(namespace, response, this.api, this.endPoint);
                }
                throw new Error('The requested namespace has no keys or does not exist.');
            }).catch((e) => {
                if (e.httpStatusCode === 404) {
                    // If namespace does not exist, provide an instance of UserDataStoreNamespace
                    // so it's possible to interact with the namespace.
                    return new UserDataStoreNamespace(namespace, null, this.api, this.endPoint);
                }
                throw e;
            });
    }

    /**
     * @static
     *
     * @returns {UserDataStore} Object with the userDataStore interaction properties
     *
     * @description
     * Get a new instance of the userDataStore object. This will function as a singleton - when a UserDataStore object has been created
     * when requesting getUserDataStore again, the original version will be returned.
     */

    static getUserDataStore() {
        if (!UserDataStore.getUserDataStore.dataStore) {
            UserDataStore.getUserDataStore.dataStore = new UserDataStore(Api.getApi(), 'userDataStore');
        }

        return UserDataStore.getUserDataStore.dataStore;
    }
}

export default UserDataStore;
