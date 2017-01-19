/* global FormData, XMLHttpRequest */
/**
 * @module System
 *
 * @requires d2/system/SystemSettings
 */
import Api from '../api/Api';
import { isString, isArray } from '../lib/check';
import { getInstance } from '../d2';
import DataStoreNamespace from './DataStoreNamespace';
/**
 * @class DataStore
 *
 * @description
 * Represents the dataStore that can be interacted with. There is a single instance of this pre-defined onto the d2
 * object after initialisation. This can be interacted with using its property objects to among other be used
 * to get and edit namespaces in the dataStore.
 */
class DataStore {
    constructor(namespaces) {
        this.endPoint = 'dataStore';
    }

    open(namespace) {
        console.log("testf")
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {

                if (!isString(namespace)) {
                    throw new TypeError('A "namespace" parameter should be specified when calling get() on dataStore');
                }

                return api.get([this.endPoint, namespace].join('/'))
                    .then((response) => {
                        if (response && isArray(response)) {
                            return new DataStoreNamespace(namespace, response);
                        }

                        return new Error('The requested namespace has no keys or does not exist.');
                    }).catch(e => {
                        if(e.httpStatusCode === 404) {
                            return new DataStoreNamespace(namespace);
                        } else {
                            throw e;
                        }
                    });
            });
    }

    getNamespaces() {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {
                return api.get([this.endPoint])
                    .then((response) => {
                        if (response && isArray(response)) {
                           return response;
                        }
                        return new Error('No namespaces exist.');
                    });
            });
    }

    delete(namespace) {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {
                return api.delete([this.endPoint,namespace].join('/n'))
            });
    }

    static dataStore() {
        if(!DataStore.dataStore.dataStore) {
            DataStore.dataStore.dataStore = new DataStore()
        }
        return DataStore.dataStore.dataStore;
    }
}

export const dataStore = (() => {
    return new DataStore();
})()

