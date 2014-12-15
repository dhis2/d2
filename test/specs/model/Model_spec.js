describe('Model', function () {
    var Model = d2.Model;
    var model;

    beforeEach(function () {
        model = new Model(); //jshint nonew:false
    });

    it('should have a create method', function () {
        expect(model.create).toEqual(jasmine.any(Function));
    });

    it('should have a save method', function () {
        expect(model.save).toEqual(jasmine.any(Function));
    });

    it('should add properties based on the modelDefinition', function () {
        var dataElementModel = Model.create(fixtures.get('modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).toBe(34);
    });
});
