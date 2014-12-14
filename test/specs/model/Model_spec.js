describe('Model', function () {
    var Model = d2.Model;
    var model = new Model(); //jshint nonew:false

    it('should have a create method', function () {
        expect(model.create).toEqual(jasmine.any(Function));
    });

    it('should have a save method', function () {
        expect(model.save).toEqual(jasmine.any(Function));
    });
});
