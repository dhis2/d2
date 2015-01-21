describe('ModelBase', function () {
    var ModelBase = require('d2/model/ModelBase');
    var modelBase;

    beforeEach(function () {
        modelBase = new ModelBase(); //jshint nonew:false
    });

    it('should have a create method', function () {
        expect(modelBase.create).toEqual(jasmine.any(Function));
    });

    it('should have a save method', function () {
        expect(modelBase.save).toEqual(jasmine.any(Function));
    });

    it('should have a validate method', function () {
        expect(modelBase.validate).toEqual(jasmine.any(Function));
    });
});
