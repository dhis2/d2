describe('ModelDefinition', function () {
    var ModelDefinition = d2.ModelDefinition;
    var modelDefinition;

    beforeEach(function () {
        modelDefinition = new ModelDefinition('dataElement');
    });

    it('should create a ModelDefinition object', function () {
        expect(modelDefinition).toEqual(jasmine.any(ModelDefinition));
    });

    it('should throw an error when a name is not specified', function () {
        function shouldThrow() {
            new ModelDefinition();
        }
        expect(shouldThrow).toThrowError('Value and type should be provided');
    });

    it('should throw if the name is not a string', function () {
        function shouldThrow() {
            new ModelDefinition({});
        }
        expect(shouldThrow).toThrowError('Expected [object Object] to have type string');
    });

    describe('createFromSchema', function () {
        it('should be a method on ModelDefinition', function () {
            expect(ModelDefinition.createFromSchema).toBeDefined();
        });
    });
});
