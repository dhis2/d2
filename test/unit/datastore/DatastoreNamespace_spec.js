import DataStore from '../../../src/datastore/DataStore';
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
        beforeEach(() => {
            apiMock.get = sinon.stub().returns(Promise.resolve(keys));
        });

        it('should return an array of keys', () => {
            expect(namespace.keys).to.be.an('array');
            expect(namespace.keys).to.be.deep.equal(keys);
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

        it('should post if the key exists and override is true', (done) => {
            const setKey = 'key1';
            namespace.set(setKey, valueData, true).then(() => {
                expect(namespace.update).not.called;
                expect(apiMock.post).to.be.calledWith(`dataStore/DHIS/${setKey}`, valueData);
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
    });

    describe('update()', () => {
        const valueData = 'value';
        beforeEach(() => {
        });

        it('should call the api with correct url', (done) => {
            const setKey = 'DHIS';
            namespace.update(setKey, valueData).then(() => {
                expect(apiMock.update).to.be.calledWith(`dataStore/DHIS/${setKey}`, valueData);
                done();
            }).catch(e => done(e));
        });
    });

});
