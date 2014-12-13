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
});
