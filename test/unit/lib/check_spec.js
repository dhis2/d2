import check from '../../../src/lib/check.js';

describe('Check', () => {
    'use strict';

    describe('isDefined', () => {
        it('should return when the parameter is defined', () => {
            expect(check.isDefined({})).to.be.true;
        });

        it('should return false when the parameter is not defined', () => {
            expect(check.isDefined(undefined)).to.be.false;
        });
    });

    describe('isType', () => {
        it('should return true if the value is of the correct type', () => {
            expect(check.isType('Mark', 'string')).to.be.true;
        });

        it('should return false when the value is not of the right type', () => {
            expect(check.isType({}, 'string')).to.be.false;
        });

        it('should return true when the value is an instance of', () => {
            expect(check.isType([], Object)).to.be.true;
        });

        it('should return false when the object is not an instance', () => {
            expect(check.isType('', Object)).to.be.false;
        });
    });

    describe('isString', () => {
        it('should return true for a string', () => {
            expect(check.isString('Mark')).to.be.true;
        });

        it('should return false for an array', () => {
            expect(check.isString([])).to.be.false;
        });
    });

    describe('isInteger', () => {
        it('should return for 1', () => {
            expect(check.isInteger(1)).to.be.true;
        });

        it('should return false for 0.1', () => {
            expect(check.isInteger(0.1)).to.be.false;
        });

        it('should return false for NaN', () => {
            expect(check.isInteger(NaN)).to.be.false;
        });

        it('should return false for an array', () => {
            expect(check.isInteger([])).to.be.false;
        });

        it('should return false for an object', () => {
            expect(check.isInteger({})).to.be.false;
        });

        it('should return false for Infinity', () => {
            expect(check.isInteger(Infinity)).to.be.false;
        });

        it('should return false for empty string', () => {
            expect(check.isInteger('')).to.be.false;
        });

        it('should return false for white space strings', () => {
            expect(check.isInteger(' ')).to.be.false;
            expect(check.isInteger('\t')).to.be.false;
            expect(check.isInteger('\n')).to.be.false;
            expect(check.isInteger('\n\r')).to.be.false;
        });
    });

    describe('isNumeric', () => {
        it('should return true for 1', () => {
            expect(check.isNumeric(1)).to.be.true;
        });

        it('should return true for 1.1', () => {
            expect(check.isNumeric(1.1)).to.be.true;
        });

        it('should return true for negative 1', () => {
            expect(check.isNumeric(-1)).to.be.true;
        });

        it('should return true for negative 1.1', () => {
            expect(check.isNumeric(-1.1)).to.be.true;
        });

        it('should return true for 0', () => {
            expect(check.isNumeric(0)).to.be.true;
        });

        it('should return false for NaN', () => {
            expect(check.isNumeric(NaN)).to.be.false;
        });

        it('should return false for an array', () => {
            expect(check.isNumeric([])).to.be.false;
        });

        it('should return false for an object', () => {
            expect(check.isNumeric({})).to.be.false;
        });

        it('should return false for Infinity', () => {
            expect(check.isNumeric(Infinity)).to.be.false;
        });

        it('should return false for empty string', () => {
            expect(check.isNumeric('')).to.be.false;
        });

        it('should return false for white space strings', () => {
            expect(check.isNumeric(' ')).to.be.false;
            expect(check.isNumeric('\t')).to.be.false;
            expect(check.isNumeric('\n')).to.be.false;
            expect(check.isNumeric('\n\r')).to.be.false;
        });

        it('should concider Infinity not to be numeric', () => {
            expect(check.isNumeric(Infinity)).to.be.false;
        });
    });

    describe('isArray', () => {
        var sinon = require('sinon');

        beforeEach(() => {
            sinon.spy(Array, 'isArray');
        });

        afterEach(() => {
            Array.isArray.restore();
        });

        it('should call Array.isArray', () => {
            check.isArray([]);

            expect(Array.isArray.calledOnce).to.be.true;
        });
    });

    describe('contains', () => {
        it('should be a function', () => {
            expect(check.contains).to.be.instanceof(Function);
        });

        it('should return true when an item is contained in the array', () => {
            var list = [3, 4, 2, 6, 7];

            expect(check.contains(2, list)).to.be.true;
        });

        it('should return false when an item is not in the list', () => {
            var list = [3, 4, 2, 6, 7];

            expect(check.contains(9, list)).to.be.false;
        });

        it('should return false if the list is not an array', () => {
            expect(check.contains(1, 'two')).to.be.false;
        });

        it('should return false when the item is undefined', () => {
            expect(check.contains(undefined, [])).to.be.false;
        });

        it('should return true when undefined is in the list', () => {
            expect(check.contains(undefined, [undefined])).to.be.true;
        });
    });

    describe('isValidUid', () => {
        it('should return true when the value is a valid uid', () => {
            expect(check.isValidUid('q2egwkkrfco')).to.be.true;
        });
    });
});
