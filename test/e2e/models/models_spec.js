describe('D2.models', function () {
    var d2;

    beforeEach(function () {
        d2 = window.d2;
    });

    it('should be available on the d2 object', function () {
        expect(d2.models).toBeDefined();
    });

    it('should have all the models', function () {
        var returnValue = function (item) { return item; };

        expect(d2.models.mapThroughDefinitions(returnValue).length).toBe(60);
    });

    it('should be able to call create on a model definition', function () {
        expect(d2.models.dataElement.create()).toEqual(jasmine.any(Object));
    });

    it('should have the correct properties', function () {
        var dataElementModel = d2.models.dataElement.create();

        expect(dataElementModel).toEqual(jasmine.any(d2.model.Model));
        expect(Object.isSealed(dataElementModel)).toBe(true);
    });

    it('should not be able to set any arbitrary properties', function () {
        var dataElementModel = d2.models.dataElement.create();

        dataElementModel.myAmazingProperty = true;

        expect(dataElementModel.myAmazingProperty).not.toBeDefined();
    });

    it('should be able to set properties defined by the schema', function () {
        var dataElementModel = d2.models.dataElement.create();

        dataElementModel.name = 'myDataElement';

        expect(dataElementModel.name).toBeDefined();
        expect(dataElementModel.name).toEqual('myDataElement');
    });
});
