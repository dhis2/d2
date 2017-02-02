import DataStore from '../../../src/datastore/DataStore';
import DataStoreNamespace from '../../../src/datastore/DataStoreNamespace';
import Api from '../../../src/api/Api';

const apiMock = {
    jquery: {
        ajax: sinon.stub(),
    },
};

describe('DataStore', () => {
    const namespaces = ['DHIS', 'History', 'social-media-video'];
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    let dataStore;
    beforeEach(() => {
        dataStore = new DataStore(apiMock);
        sinon.stub(Api, 'getApi').returns(apiMock);
    });

    afterEach(() => {
        Api.getApi.restore();
    });


    describe('open()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
        });

        it('should return an instance of datastorenamespace', (done) => {
            dataStore.open('DHIS').then((namespace) => {
                expect(namespace).to.be.instanceOf(DataStoreNamespace);
                done();
            });
        });

        it('should return a datastorenamespace with keys if it exists', (done) => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
            dataStore.open('DHIS').then((namespace) => {
                expect(namespace.getKeys()).to.deep.equal(keys);
                expect(apiMock.get).calledOnce;
                done();
            }).catch(e => done(e));
        });

        it('should not request API if autoload is false', (done) => {
            dataStore.open('DHIS', false).then(() => {
                expect(apiMock.get).not.called;
                done();
            }).catch(e => done(e));
        });
    });

    describe('getNamespaces()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(namespaces));
        });

        it('should return an array of namespaces', (done) => {
            dataStore.getNamespaces().then((namespaceRes) => {
                expect(namespaces).to.be.deep.equal(namespaceRes);
                done();
            }).catch(e => done(e));
        });
    });

    describe('delete()', () => {
        beforeEach(() => {
            apiMock.delete = sinon.stub().returns(Promise.resolve());
        });

        it('should call the api with correct url', (done) => {
            const namespaceDel = 'DHIS';
            dataStore.delete(namespaceDel).then(() => {
                expect(apiMock.delete).to.be.calledWith(`dataStore/${namespaceDel}`);
                done();
            }).catch(e => done(e));
        });
    });
});
