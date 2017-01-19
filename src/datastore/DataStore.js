/* global FormData, XMLHttpRequest */
/**
 * @module System
 *
 * @requires d2/system/SystemSettings
 */
import Api from '../api/Api';
import { isString } from '../lib/check';
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
        console.log("test")
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {

                if (!isString(namespace)) {
                    throw new TypeError('A "namespace" parameter should be specified when calling get() on dataStore');
                }

                return api.get([this.endPoint, namespace].join('/'))
                    .then((response) => {
                        console.log(response)
                        if (response) {
                            resolve(new DataStoreNamespace(namespace, response));
                        }
                        return new Error('The requested namespace has no keys or does not exist.');
                    });
            });
    }

    openAll() {

    }

    delete(namespace) {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {
                return api.delete([this.endPoint,namespace].join('/n'))
            });
    }

    create(namespace) {
        return getInstance()
            .then(d2 => d2.Api.getApi())
            .then(api => {
               return api.post([this.endPoint,namespace].join('/n'))
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
    return DataStore();
})

export dataStore;
