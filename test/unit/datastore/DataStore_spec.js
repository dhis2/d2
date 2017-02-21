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


    describe('get()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
        });

        it('should return an instance of datastorenamespace', (done) => {
            dataStore.get('DHIS').then((namespace) => {
                expect(namespace).to.be.instanceOf(DataStoreNamespace);
                done();
            });
        });

        it('should return a datastorenamespace with keys if it exists', (done) => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
            dataStore.get('DHIS').then((namespace) => {
                namespace.getKeys().then((res) => {
                    expect(res).to.deep.equal(keys);
                    expect(apiMock.get).to.be.calledOnce;
                    done();
                }).catch(e => done(e));
            }).catch(e => done(e));
        });

        it('should not request API if autoload is false', (done) => {
            dataStore.get('DHIS', false).then(() => {
                expect(apiMock.get).not.called;
                done();
            }).catch(e => done(e));
        });

        it('should throw an error when no response', (done) => {
            apiMock.get = sinon.stub().returns(Promise.resolve(null));
            dataStore.get('DHIS').catch(e => {
                expect(e.message).to.equal('The requested namespace has no keys or does not exist.');
                done();
            });
        });

        it('should return an instance of Datastorenamespace if it does not exist on server', (done) => {
            apiMock.get = sinon.stub().returns(Promise.reject({httpStatusCode: 404}));
            dataStore.get('DHIS').then(namespace => {
                    expect(namespace).to.be.instanceOf(DataStoreNamespace);
                    done();
            }).catch(e => done(e));

            it('should throw when error is not 404', (done) => {
                let error = {httpStatusCode: 500};
                apiMock.get = sinon.stub().returns(Promise.reject(error));
                dataStore.get('DHIS').catch(e => {
                    expect(e).to.deep.equal(error);
                    done();
                });
            });
        });
    });

    describe('getAll()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(namespaces));
        });

        it('should return an array of namespaces', (done) => {
            dataStore.getAll().then((namespaceRes) => {
                expect(namespaces).to.be.deep.equal(namespaceRes);
                done();
            }).catch(e => done(e));
        });

        it('should throw an error when there is no response', (done) => {
            apiMock.get = sinon.stub().returns(Promise.resolve(null));

            dataStore.getAll()
                .catch((namespaceRes) => {
                    expect(namespaceRes.message).to.equal('No namespaces exist.');
                    done();
                });
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

    describe('getDataStore', () => {
        it('should return an instance of DataStore', () => {
            expect(DataStore.getDataStore()).to.be.instanceof(DataStore);
        });

        it('should return the same object when called twice', () => {
            expect(DataStore.getDataStore()).to.equal(DataStore.getDataStore());
        });
    });
});
