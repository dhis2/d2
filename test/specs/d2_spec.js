/* global isDefined, isType, isString, isInteger, isNumeric, throwError */
describe('D2', function () {
    var d2;
    beforeEach(function () {
        d2 = window.d2;
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
            expect(isDefined({})).toBe(true);
        });

        it('should return false when the parameter is not defined', function () {
            expect(isDefined(undefined)).toBe(false);
        });
    });

    describe('isType', function () {
        it('should return true if the value is of the correct type', function () {
            expect(isType('Mark', 'string')).toBe(true);
        });

        it('should return false when the value is not of the right type', function () {
            expect(isType({}, 'string')).toBe(false);
        });

        it('should return true when the value is an instance of', function () {
            expect(isType([], Object)).toBe(true);
        });

        it('should return false when the object is not an instance', function () {
            expect(isType('', Object)).toBe(false);
        });
    });

    describe('isString', function () {
        it('should call isType with predefined type', function () {
            spyOn(window, 'isType');

            isString('Mark');

            expect(isType).toHaveBeenCalledWith('Mark', 'string');
        });
    });

    describe('isInteger', function () {
        it('should return for 1', function () {
            expect(isInteger(1)).toBe(true);
        });

        it('should return false for 0.1', function () {
            expect(isInteger(0.1)).toBe(false);
        });

        it('should return false for NaN', function () {
            expect(isInteger(NaN)).toBe(false);
        });

        it('should return false for an array', function () {
            expect(isInteger([])).toBe(false);
        });

        it('should return false for an object', function () {
            expect(isInteger({})).toBe(false);
        });

        it('should return false for Infinity', function () {
            expect(isInteger(Infinity)).toBe(false);
        });

        it('should return false for empty string', function () {
            expect(isInteger('')).toBe(false);
        });

        it('should return false for white space strings', function () {
            expect(isInteger(' ')).toBe(false);
            expect(isInteger('\t')).toBe(false);
            expect(isInteger('\n')).toBe(false);
            expect(isInteger('\n\r')).toBe(false);
        });
    });

    describe('isNumeric', function () {
        it('should return true for 1', function () {
            expect(isNumeric(1)).toBe(true);
        });

        it('should return true for 1.1', function () {
            expect(isNumeric(1.1)).toBe(true);
        });

        it('should return true for negative 1', function () {
            expect(isNumeric(-1)).toBe(true);
        });

        it('should return true for negative 1.1', function () {
            expect(isNumeric(-1.1)).toBe(true);
        });

        it('should return true for 0', function () {
            expect(isNumeric(0)).toBe(true);
        });

        it('should return false for NaN', function () {
            expect(isNumeric(NaN)).toBe(false);
        });

        it('should return false for an array', function () {
            expect(isNumeric([])).toBe(false);
        });

        it('should return false for an object', function () {
            expect(isNumeric({})).toBe(false);
        });

        it('should return false for Infinity', function () {
            expect(isNumeric(Infinity)).toBe(false);
        });

        it('should return false for empty string', function () {
            expect(isNumeric('')).toBe(false);
        });

        it('should return false for white space strings', function () {
            expect(isNumeric(' ')).toBe(false);
            expect(isNumeric('\t')).toBe(false);
            expect(isNumeric('\n')).toBe(false);
            expect(isNumeric('\n\r')).toBe(false);
        });
    });

    describe('throwError', function () {
        it('should throw an error', function () {
            function shouldThrow() {
                throwError('MyMessage');
            }

            expect(shouldThrow).toThrowError('MyMessage');
        });
    });
});
