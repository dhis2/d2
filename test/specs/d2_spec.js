describe('D2', function () {
    var d2;
    var check = require('d2/lib/check');
    var utils = require('d2/lib/utils');
    var fixtures = require('fixtures/fixtures');
    var sinon = require('sinon');

    beforeEach(function () {
        d2 = require('d2/d2');
    });

    it('should be an object', function () {
        expect(d2).toBeDefined();
    });

    it('should get the classname', function () {
        var dataElementSchema = fixtures.get('/api/schemas/dataElement');

        expect(dataElementSchema.klass).toEqual('org.hisp.dhis.dataelement.DataElement');
    });

    describe('isDefined', function () {
        it('should return when the parameter is defined', function () {
            expect(check.isDefined({})).toBe(true);
        });

        it('should return false when the parameter is not defined', function () {
            expect(check.isDefined(undefined)).toBe(false);
        });
    });

    describe('isType', function () {
        it('should return true if the value is of the correct type', function () {
            expect(check.isType('Mark', 'string')).toBe(true);
        });

        it('should return false when the value is not of the right type', function () {
            expect(check.isType({}, 'string')).toBe(false);
        });

        it('should return true when the value is an instance of', function () {
            expect(check.isType([], Object)).toBe(true);
        });

        it('should return false when the object is not an instance', function () {
            expect(check.isType('', Object)).toBe(false);
        });
    });

    describe('isString', function () {
        it('should return true for a string', function () {
            expect(check.isString('Mark')).toBe(true);
        });

        it('should return false for an array', function () {
            expect(check.isString([])).toBe(false);
        });
    });

    describe('isInteger', function () {
        it('should return for 1', function () {
            expect(check.isInteger(1)).toBe(true);
        });

        it('should return false for 0.1', function () {
            expect(check.isInteger(0.1)).toBe(false);
        });

        it('should return false for NaN', function () {
            expect(check.isInteger(NaN)).toBe(false);
        });

        it('should return false for an array', function () {
            expect(check.isInteger([])).toBe(false);
        });

        it('should return false for an object', function () {
            expect(check.isInteger({})).toBe(false);
        });

        it('should return false for Infinity', function () {
            expect(check.isInteger(Infinity)).toBe(false);
        });

        it('should return false for empty string', function () {
            expect(check.isInteger('')).toBe(false);
        });

        it('should return false for white space strings', function () {
            expect(check.isInteger(' ')).toBe(false);
            expect(check.isInteger('\t')).toBe(false);
            expect(check.isInteger('\n')).toBe(false);
            expect(check.isInteger('\n\r')).toBe(false);
        });
    });

    describe('isNumeric', function () {
        it('should return true for 1', function () {
            expect(check.isNumeric(1)).toBe(true);
        });

        it('should return true for 1.1', function () {
            expect(check.isNumeric(1.1)).toBe(true);
        });

        it('should return true for negative 1', function () {
            expect(check.isNumeric(-1)).toBe(true);
        });

        it('should return true for negative 1.1', function () {
            expect(check.isNumeric(-1.1)).toBe(true);
        });

        it('should return true for 0', function () {
            expect(check.isNumeric(0)).toBe(true);
        });

        it('should return false for NaN', function () {
            expect(check.isNumeric(NaN)).toBe(false);
        });

        it('should return false for an array', function () {
            expect(check.isNumeric([])).toBe(false);
        });

        it('should return false for an object', function () {
            expect(check.isNumeric({})).toBe(false);
        });

        it('should return false for Infinity', function () {
            expect(check.isNumeric(Infinity)).toBe(false);
        });

        it('should return false for empty string', function () {
            expect(check.isNumeric('')).toBe(false);
        });

        it('should return false for white space strings', function () {
            expect(check.isNumeric(' ')).toBe(false);
            expect(check.isNumeric('\t')).toBe(false);
            expect(check.isNumeric('\n')).toBe(false);
            expect(check.isNumeric('\n\r')).toBe(false);
        });
    });

    describe('throwError', function () {
        it('should throw an error', function () {
            function shouldThrow() {
                utils.throwError('MyMessage');
            }

            expect(shouldThrow).toThrowError('MyMessage');
        });
    });

    describe('contains', function () {
        it('should be a function', function () {
            expect(check.contains).toEqual(jasmine.any(Function));
        });

        it('should return true when an item is contained in the array', function () {
            var list = [3, 4, 2, 6, 7];

            expect(check.contains(2, list)).toBe(true);
        });

        it('should return false when an item is not in the list', function () {
            var list = [3, 4, 2, 6, 7];

            expect(check.contains(9, list)).toBe(false);
        });

        it('should return false if the list is not an array', function () {
            expect(check.contains(1, 'two')).toBe(false);
        });

        it('should return false when the item is undefined', function () {
            expect(check.contains(undefined, [])).toBe(false);
        });

        it('should return true when undefined is in the list', function () {
            expect(check.contains(undefined, [undefined])).toBe(true);
        });
    });

    describe('isArray', function () {
        beforeEach(function () {
            sinon.spy(Array, 'isArray');
        });

        afterEach(function () {
            Array.isArray.restore();
        });

        it('should call Array.isArray', function () {
            check.isArray([]);

            expect(Array.isArray.calledOnce).toBe(true);
        });
    });
});
