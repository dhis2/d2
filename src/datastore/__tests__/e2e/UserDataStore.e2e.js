import 'isomorphic-fetch';
import { init } from '../../../d2';
import UserDataStoreNamespace from '../../UserDataStoreNamespace';

describe('UserDataStore', () => {
    const credentials = `Basic ${btoa('admin:district')}`;
    let d2;
    let namespace;

    beforeAll(async () => {
        d2 = await init({ baseUrl: 'https://play.dhis2.org/demo/api', schemas: [], headers: { authorization: credentials } });
        namespace = await d2.currentUser.dataStore.get('namespace');
        await namespace.delete();
    });

    afterAll(async () => {
        await namespace.delete();
    });

    describe('get()', () => {
        it('should work async', async () => {
            const value = { value: '123' };
            const key = 'key';
            await namespace.set(key, value);
            const retVal = await namespace.get(key);

            expect(Array.isArray(namespace.keys)).toBe(true);
            expect(namespace.keys).toEqual([key]);
            expect(retVal).toEqual(value);
        });

        it('should work when autoLoad = false', async () => {
            const ns = await d2.currentUser.dataStore.get('another namespace', false);

            expect(ns).toBeInstanceOf(UserDataStoreNamespace);
            expect(ns.keys).toHaveLength(0);
        });
    });

    describe('getAll()', () => {
        it('should work async', async () => {
            const newNamespace = await d2.currentUser.dataStore.get('new namespace');
            const stringVal = 'a random string';
            await newNamespace.set('key', stringVal);

            const namespaces = await d2.currentUser.dataStore.getAll();
            const serverVal = await newNamespace.get('key');

            expect(namespaces).toContain(newNamespace.namespace);
            expect(serverVal).toEqual(stringVal);

            newNamespace.delete();
        });
    });
});
