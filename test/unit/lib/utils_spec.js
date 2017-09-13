describe('Utils', () => {
    let utils;

    beforeEach(() => {
        utils = require('../../../src/lib/utils');
    });

    describe('throwError', () => {
        it('should throw an error', () => {
            function shouldThrow() {
                utils.throwError('MyMessage');
            }

            expect(shouldThrow).toThrowError('MyMessage');
        });
    });

    describe('pick', () => {
        const object = {
            name: 'Mark',
            users: [
                'mark', 'this', 'color',
            ],
        };

        it('should return the value of the property', () => {
            expect(utils.pick('name')(object)).toBe('Mark');
            expect(utils.pick('users')(object)).toBe(object.users);
        });

        it('should return undefined if the property does not exist', () => {
            expect(utils.pick('groups')(object)).toBeUndefined();
        });

        it('should return undefined if the object is undefined', () => {
            expect(utils.pick('name')(undefined)).toBeUndefined();
        });
    });
});
