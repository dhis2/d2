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
});
