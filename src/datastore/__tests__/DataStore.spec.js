import DataStore from '../../datastore/DataStore';
import DataStoreNamespace from '../../datastore/DataStoreNamespace';
import MockApi from '../../api/Api';

jest.mock('../../api/Api');

describe('DataStore', () => {
    const namespaces = ['DHIS', 'History', 'social-media-video'];
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    let dataStore;
    let apiMock;

    beforeEach(() => {
        apiMock = new MockApi();
        dataStore = new DataStore(apiMock);
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    describe('get()', () => {
        beforeEach(() => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(keys));
        });

        it('should return an instance of datastorenamespace', () => dataStore.get('DHIS').then((namespace) => {
            expect(namespace).toBeInstanceOf(DataStoreNamespace);
        }));

        it('should return a datastorenamespace with keys if it exists', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(keys));

            return dataStore.get('DHIS').then(namespace => namespace.getKeys().then((res) => {
                expect(res).toEqual(keys);
                expect(apiMock.get).toHaveBeenCalledTimes(1);
            }));
        });

        it('should not request API if autoload is false', () => dataStore.get('DHIS', false).then(() => {
            expect(apiMock.get).not.toHaveBeenCalled();
        }));

        it('should throw an error when no response', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(null));

            return dataStore.get('DHIS').catch((e) => {
                expect(e.message).toBe('The requested namespace has no keys or does not exist.');
            });
        });

        it('should return an instance of Datastorenamespace if it does not exist on server', () => {
            apiMock.get.mockReturnValueOnce(Promise.reject({ httpStatusCode: 404 }));

            return dataStore.get('DHIS').then((namespace) => {
                expect(namespace).toBeInstanceOf(DataStoreNamespace);
            });
        });

        it('should throw when error is not 404', () => {
            const error = { httpStatusCode: 500 };
            apiMock.get.mockReturnValueOnce(Promise.reject(error));

            return dataStore.get('DHIS')
                .catch((e) => {
                    expect(e).toEqual(error);
                });
        });
    });

    describe('getAll()', () => {
        beforeEach(() => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(namespaces));
        });

        it('should return an array of namespaces', () => dataStore.getAll().then((namespaceRes) => {
            expect(namespaces).toEqual(namespaceRes);
        }));

        it('should throw an error when there is no response', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(null));

            return dataStore.getAll()
                .catch((namespaceRes) => {
                    expect(namespaceRes.message).toBe('No namespaces exist.');
                });
        });
    });

    describe('delete()', () => {
        beforeEach(() => {
            apiMock.delete.mockReturnValueOnce(Promise.resolve());
        });

        it('should call the api with correct url', () => {
            const namespaceDel = 'DHIS';

            return dataStore.delete(namespaceDel).then(() => {
                expect(apiMock.delete).toBeCalledWith(`dataStore/${namespaceDel}`);
            });
        });
    });

    describe('getDataStore', () => {
        it('should return an instance of DataStore', () => {
            expect(DataStore.getDataStore()).toBeInstanceOf(DataStore);
        });

        it('should return the same object when called twice', () => {
            expect(DataStore.getDataStore()).toBe(DataStore.getDataStore());
        });
    });
});
