import BaseStore from './BaseStore';
import UserDataStoreNamespace from './UserDataStoreNamespace';
import Api from '../api/Api';

/**
 * @augments module:datastore.BaseStore
 * @description
 * Represents the UserDataStore that can be interacted with. This can be used to get instances of UserDataStoreNamespace, which
 * can be used to interact with the {@link module:current-user.UserDataStoreNamespace namespace API}.
 *
 * The store is a key-value store, where a namespace contains a list of keys, and
 * a key corresponds to an arbitrary JSON-object. The store is per-user, and only the currently logged-in user
 * has access to the namespaces.
 *
 * Note that a namespace cannot exist without at least one key-value pair, for this reason
 * there is no 'create'- method. It is therefore advised to call {@link module:current-user.UserDataStore#get get} with
 * <code>autoLoad = false</code> if you are creating a namespace (in combination with {@link module:current-user.UserDataStoreNamespace#set set})
 * (or you will get a 404-error in the console, as it tries to load a namespace that does not exist).
 *
 * @example <caption>Getting a value with promise-syntax</caption>
 * import { init } from 'd2';
 *
 * init({baseUrl: 'https://play.dhis2.org/demo/api'})
 *   .then((d2) => {
 *     d2.userDataStore.get('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
 *
 * @example <caption>Creation of namespace with async-syntax</caption>
 * const namespace = await d2.userDataStore.get('new namespace', false);
 * // The namespace is not actually created on the server before this is called
 * await namespace.set('new key', value);
 *
 * @memberof module:current-user
 */
class UserDataStore extends BaseStore {
    constructor(api = Api.getApi(), endPoint = 'dataStore') {
        super(api, endPoint);
    }

    /**
     * @description
     * Retrieves a list of keys for the given namespace, and returns an instance of UserDataStoreNamespace that
     * may be used to interact with this namespace. See {@link module:current-user.UserDataStoreNamespace UserDataStoreNamespace}.
     *
     * @param {string} namespace - Namespace to get.
     * @param {boolean=} [autoLoad=true] - If true, autoloads the keys of the namespace from the server
     * before the namespace is created. If false, an instance of he namespace is returned without any keys.
     *
     *
     * @returns {Promise<UserDataStoreNamespace>} An instance of a UserDataStoreNamespace representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true) {
        return super.get(namespace, autoLoad, UserDataStoreNamespace);
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
