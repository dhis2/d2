describe('ModelBase', function () {
    var modelBase = require('d2/model/ModelBase');

    it('should have a create method', function () {
        expect(modelBase.create).to.be.instanceof(Function);
    });

    it('should have a save method', function () {
        expect(modelBase.save).to.be.instanceof(Function);
    });

    it('should have a validate method', function () {
        expect(modelBase.validate).to.be.instanceof(Function);
    });
});
