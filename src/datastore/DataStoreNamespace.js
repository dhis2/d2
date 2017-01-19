import { Api } from '../api/Api';
import { isString } from '../lib/check';

class DataStoreNamespace {
    constructor(namespace,keys, api = Api.getApi()) {
        this.api = api;
        this.namespace = namespace;
        
        if(keys) {
            this.keys = keys;
        }
    }

    get(key) {
        return this.keys
            ? Promise.resolve(this.keys)
            : this.api.get(['dataStore',key].join('/'))
            .then((keys) => { this.keys = keys; return Promise.resolve(this.keys); });
    }

    getAll() {

    }

    set(key) {

    }


    delete() {

    }

    update(key) {

    }

}

export default DataStoreNamespace;