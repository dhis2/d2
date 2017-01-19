import Api from '../api/Api';
import { isString, isArray } from '../lib/check';

class DataStoreNamespace {

    constructor(namespace, keys, api = Api.getApi()) {
        this.api = api;
        this.namespace = namespace;
        this.keys = keys || [];
        this.endPoint = 'dataStore';
    }

    getKeys() {
        return this.keys;
    }

    get(key) {
        return this.api.get([this.endPoint,this.namespace,key].join('/'))
    }

    set(key, value, overrideUpdate = false) {
        if(!overrideUpdate && this.keys.includes(key)) {
            return this.update(key, value);
        }
        return this.api.post([this.endPoint,this.namespace, key].join('/'), value)
    }


    delete(key) {
        return this.api.delete([this.endPoint,this.namespace, key].join('/'))
    }

    update(key, value, useMergeStrategy = false) {
        return this.api.update(['dataStore',key].join('/'), value, useMergeStrategy);
    }

    refresh() {
        return this.api.get([this.endPoint, this.namespace].join('/'))
            .then((response) => {
                if (response && isArray(response)) {
                    this.keys = response;
                    return this;
                }
                return new Error('The requested namespace has no keys or does not exist.');
            });
    }

}

export default DataStoreNamespace;