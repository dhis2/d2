import * as utils from '../utils';

describe('Utils', () => {
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

        it('should support property paths', () => {
            const value = {
                user: {
                    name: 'Mark',
                    settings: {
                        disabled: false,
                    },
                },
            };

            expect(utils.pick('user.name')(value)).toBe('Mark');
            expect(utils.pick('user.settings.disabled')(value)).toBe(false);
        });

        it('should not throw when a property in the path does not exist', () => {
            const value = {};

            expect(() => utils.pick('user.name')(value)).not.toThrow();
            expect(() => utils.pick('user.settings.disabled')(value)).not.toThrow();
        });
    });

    describe('updateAPIUrlWithBaseUrlVersionNumber()', () => {
        const baseUrl = 'https://www.whitehouse.gov/secret/top/dhis/api';

        it('works with unreasonable api versions', () => {
            for (let i = 10; i < 99; i++) {
                expect(utils.updateAPIUrlWithBaseUrlVersionNumber(
                    'https://localhost:8080/dhis/api/dataSetElements/abcDEFghi3',
                    `${baseUrl}/${i}`,
                )).toBe(`https://localhost:8080/dhis/api/${i}/dataSetElements/abcDEFghi3`);
            }
        });
    });
});
