/* global isDefined, isType */
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
});
