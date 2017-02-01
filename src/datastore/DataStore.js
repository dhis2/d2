import { isString, isArray } from '../lib/check';
import { getInstance } from '../d2';
import DataStoreNamespace from './DataStoreNamespace';

/**
 * @class DataStore
 *
 * @description
 * Represents the dataStore that can be interacted with. This can be used to get instances of DataStoreNamespace, which
 * can be used to interact with the namespace API.
 */
class DataStore {
    constructor() {
        this.endPoint = 'dataStore';
    }

    /**
     * Retrieves a list of keys for the given namespace, and returns an instance of DataStoreNamespace that
     * may be used to interact with this namespace. See {@link DataStoreNamespace}.
     * @param namespace to open.
     * @param autoLoad if true, autoloads the keys of the namespace loading the namespace. If false, an instance of
     * the namespace is returned, and you may use the namespace directly.
     * Note that you might want to use namespace.refresh(), to load namespaces.
     * @returns {Promise<DataStoreNamespace>} An instance of a DataStoreNamespace representing the namespace that can be interacted with.
     */
    open(namespace, autoLoad = true) {
        if (!isString(namespace)) {
            throw new TypeError('A "namespace" parameter should be specified when calling open() on dataStore');
        }

        if (!autoLoad) {
            return new Promise((resolve) => {
                resolve(new DataStoreNamespace(namespace));
            });
        }

        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then((api) => {
                return api.get([this.endPoint, namespace].join('/'))
                    .then((response) => {
                        if (response && isArray(response)) {
                            return new DataStoreNamespace(namespace, response);
                        }
                        return new Error('The requested namespace has no keys or does not exist.');
                    }).catch((e) => {
                        if (e.httpStatusCode === 404) {
                            // If namespace does not exist, provide an instance of DataStoreNamespace
                            // so it's possible to interact with the namespace.
                            return new DataStoreNamespace(namespace);
                        }
                        throw e;
                    });
            });
    }

    /**
     * Retrieves a list of all public namespaces on the server.
     * @returns {Promise} with an array of namespaces.
     */
    getNamespaces() {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then((api) => {
                return api.get([this.endPoint])
                    .then((response) => {
                        if (response && isArray(response)) {
                            return response;
                        }
                        return new Error('No namespaces exist.');
                    });
            });
    }

    /**
     * Deletes a namespace
     * @param namespace to delete
     * @returns {Promise} with the response from the API.
     */
    delete(namespace) {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then((api) => {
                return api.delete([this.endPoint, namespace].join('/n'));
            });
    }

}

export const dataStore = (() =>
    new DataStore())();

