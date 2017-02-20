import DataStoreNamespace from '../../../src/datastore/DataStoreNamespace';
import Api from '../../../src/api/Api';

const apiMock = {
    jquery: {
        ajax: sinon.stub(),
    },
};

describe('DataStoreNamespace', () => {
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    let namespace;
    beforeEach(() => {
        namespace = new DataStoreNamespace('DHIS', keys, apiMock);
        sinon.stub(Api, 'getApi').returns(apiMock);
        apiMock.post = sinon.stub().returns(Promise.resolve());
        apiMock.update = sinon.stub().returns(Promise.resolve());
        apiMock.delete = sinon.stub().returns(Promise.resolve());
    });

    afterEach(() => {
        Api.getApi.restore();
    });

    it('should throw an error if not called with a string', () => {
        expect(() => new DataStoreNamespace()).to.throw('DataStoreNamespaces must be called with a string to identify the Namespace');
    });

    it('should contain an array of keys', () => {
        expect(namespace.keys).to.be.an('array');
        expect(namespace.keys).to.be.deep.equal(keys);
    });

    it('should contain a string of a namespace', () => {
        expect(namespace.namespace).to.be.a('string');
    });

    describe('getKeys()', () => {
        const refreshedKeys = keys.concat('newkey');
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(refreshedKeys));
        });

        it('should return an array of keys', (done) => {
            namespace.getKeys().then((res) => {
                expect(res).to.be.deep.equal(keys);
                done();
            }).catch(e => done(e));
        });

        it('should not call remote api if forceload is false or not present', (done) => {
            namespace.getKeys().then((res) => {
                expect(res).to.be.deep.equal(keys);
                expect(apiMock.get).to.not.be.called;
                done();
            }).catch(e => done(e));
        });

        it('should call remote api if forceload is true and update internal array', (done) => {
            namespace.getKeys(true).then((res) => {
                expect(res).to.be.deep.equal(refreshedKeys);
                expect(namespace.keys).to.be.deep.equal(refreshedKeys);
                expect(apiMock.get).to.be.calledWith('dataStore/DHIS');
                done();
            }).catch(e => done(e));
        });

        it('should throw an error when there is no response', (done) => {
            apiMock.get.returns(Promise.resolve(null));
            apiMock.get = sinon.stub().returns(Promise.resolve({}))

            namespace.getKeys(true)
                .catch((namespaceRes) => {
                    expect(namespaceRes.message).to.equal('The requested namespace has no keys or does not exist.');
                    done();
                })
        });
    });

    describe('get()', () => {
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve('value'));
        });

        it('should call API with correct parameters', (done) => {
            namespace.get('key1').then((val) => {
                expect(apiMock.get).to.be.calledWith('dataStore/DHIS/key1');
                done();
            }).catch(e => done(e));
        });

        it('should return a value', (done) => {
            namespace.get('key1').then((val) => {
                expect(val).to.be.equal('value');
                done();
            }).catch(e => done(e));
        });
    });

    describe('getMetaData()', () => {
        const key = 'key1';
        const metaObj = { created: '2017-01-22T14:15:14.176', lastUpdated: '2017-01-22T14:15:14.176', externalAccess: false, namespace: 'DHIS', key: 'key1', value: '{}', id: 'B6SZPkuigc0' };
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(metaObj));
        });

        it('should retrieve an object with metaData', (done) => {
            namespace.getMetaData(key).then((res) => {
                expect(res).to.be.equal(metaObj);
                done();
            }).catch(e => done(e));
        });

        it('should call api.get() with correct parameters', (done) => {
            namespace.getMetaData(key).then((res) => {
                expect(apiMock.get).to.be.calledWith(`dataStore/DHIS/${key}/metaData`);
                done();
            }).catch(e => done(e));
        });
    });

    describe('set()', () => {
        const valueData = 'value';
        beforeEach(() => {
            namespace.update = sinon.spy(namespace.update);
        });

        it('should call the api with correct url', (done) => {
            const setKey = 'DHIS2';
            namespace.set(setKey, valueData).then(() => {
                expect(apiMock.post).to.be.calledWith(`dataStore/DHIS/${setKey}`, valueData);
                done();
            }).catch(e => done(e));
        });

        it('should update if the key exists', (done) => {
            const setKey = 'key1';
            namespace.set(setKey, valueData).then(() => {
                expect(namespace.update).to.be.calledWith(setKey, valueData);
                expect(apiMock.update).to.be.calledWith(`dataStore/DHIS/${setKey}`);
                done();
            }).catch(e => done(e));
        });

        it('should call post if the key exists and override is true', (done) => {
            const setKey = 'key1';
            namespace.set(setKey, valueData, true).then(() => {
                expect(namespace.update).not.called;
                expect(apiMock.post).to.be.calledWith(`dataStore/DHIS/${setKey}`, valueData);
                done();
            }).catch(e => done(e));
        });

        it('should add key to internal array', (done) => {
            const arr = namespace.keys;
            const key = 'key';
            namespace.set('key', valueData).then(() => {
                expect(namespace.keys).to.be.deep.equals(arr.concat(key));
                done();
            }).catch(e => done(e));
        });
    });

    describe('delete()', () => {
        it('should call api.delete() with the correct url', (done) => {
            namespace.delete('key1').then(() => {
                expect(apiMock.delete).to.be.calledWith('dataStore/DHIS/key1');
                done();
            }).catch(e => done(e));
        });

        it('should delete key from internal array', (done) => {
            const orgLen = namespace.keys.length;
            namespace.delete('key1').then(() => {
                expect(namespace.keys.length).to.be.equal(orgLen - 1);
                done();
            }).catch(e => done(e));
        });
    });

    describe('update()', () => {
        const valueData = 'value';

        it('should call the api with correct url', (done) => {
            const setKey = 'DHIS';
            namespace.update(setKey, valueData).then(() => {
                expect(apiMock.update).to.be.calledWith(`dataStore/DHIS/${setKey}`, valueData);
                done();
            }).catch(e => done(e));
        });
    });
});
