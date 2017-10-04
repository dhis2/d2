import 'isomorphic-fetch';
import { init } from '../../d2';

describe('UserDataStore', () => {
    const credentials = `Basic ${btoa('admin:district')}`;

    describe('get()', () => {
        it('should work async', async () => {
            const value = { value: '123' };
            const namespace = 'namespace';
            const key = 'key';
            const d2 = await init({ baseUrl: 'https://play.dhis2.org/dev/api', schemas: [], headers: { authorization: credentials } });
            const ns = await d2.userDataStore.get(namespace);
            ns.set('key', value);
            const retVal = await ns.get(key);

            expect(Array.isArray(ns.keys)).toBe(true);
            expect(ns.keys).toEqual([key]);
            expect(retVal).toEqual(value);
        });
    });
});
