describe('Utils', function () {
    var utils;

    beforeEach(function () {
        utils = require('d2/lib/utils');
    });

    describe('throwError', function () {
        it('should throw an error', function () {
            function shouldThrow() {
                utils.throwError('MyMessage');
            }

            expect(shouldThrow).toThrowError('MyMessage');
        });
    });

    describe('pick', function () {
        var object = {
            name: 'Mark',
            users: [
                'mark', 'this', 'color'
            ]
        };

        it('should return the value of the property', function () {
            expect(utils.pick('name')(object)).toBe('Mark');
            expect(utils.pick('users')(object)).toBe(object.users);
        });

        it('should return undefined if the property does not exist', function () {
            expect(utils.pick('groups')(object)).toBe(undefined);
        });

        it('should return undefined if the object is undefined', function () {
            expect(utils.pick('name')(undefined)).toBe(undefined);
        });
    });
});
