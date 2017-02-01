import { dataStore } from '../../../src/datastore/DataStore';
import DataStore from '../../../src/datastore/DataStore';
import DataStoreNamespace from '../../../src/datastore/DataStoreNamespace';
import Api from '../../../src/api/Api';
import { init } from '../../../src/d2';

const apiMock = {
    jquery: {
        ajax: sinon.stub(),
    },
};

describe('DataStore', () => {
    const namespaces = ['DHIS', 'History', 'social-media-video'];
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    const dataStore = new DataStore(apiMock);
    beforeEach(() => {
        sinon.stub(Api, 'getApi').returns(apiMock);
    });

    afterEach(() => {
        Api.getApi.restore();
    });


    describe('open()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
        });

        it('should return an instance of datastorenamespace', () => {
            dataStore.open('DHIS').then((namespace) => {
                expect(namespace).to.be.instanceOf(DataStoreNamespace);
            });
        });

        it('should return a datastorenamespace with keys if it exists', () => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
            dataStore.open('DHIS').then(namespace =>
                expect(namespace.getKeys()).to.deep.equal(keys));
        });
    });
});
