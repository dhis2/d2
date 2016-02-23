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

            expect(shouldThrow).to.throw('MyMessage');
        });
    });

    describe('pick', () => {
        var object = {
            name: 'Mark',
            users: [
                'mark', 'this', 'color',
            ]
        };

        it('should return the value of the property', () => {
            expect(utils.pick('name')(object)).to.equal('Mark');
            expect(utils.pick('users')(object)).to.equal(object.users);
        });

        it('should return undefined if the property does not exist', () => {
            expect(utils.pick('groups')(object)).to.be.undefined;
        });

        it('should return undefined if the object is undefined', () => {
            expect(utils.pick('name')(undefined)).to.be.undefined;
        });
    });
});
