/* jshint nonew:false */
describe('ModelDefinition', function () {
    'use strict';

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
        expect(shouldThrow).toThrowError('Value should be provided');
    });

    it('should throw if the name is not a string', function () {
        function shouldThrow() {
            new ModelDefinition({});
        }
        expect(shouldThrow).toThrowError('Expected [object Object] to have type string');
    });

    describe('instance', function () {
        it('should have a addProperty method', function () {
            expect(modelDefinition.addProperty).toEqual(jasmine.any(Function));
        });

        it('should not be able to change the name', function () {
            var isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').writable;
            var isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').configurable;

            expect(isWritable).toBe(false);
            expect(isConfigurable).toBe(false);
        });

        it('should not change the name', function () {
            function shouldThrow() {
                modelDefinition.name = 'anotherName';

                if (modelDefinition.name !== 'anotherName') {
                    throw new Error('');
                }
            }

            expect(modelDefinition.name).toEqual('dataElement');
            expect(shouldThrow).toThrow();
        });

        it('should not be able to change the isMetaData', function () {
            var isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').writable;
            var isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').configurable;

            expect(isWritable).toBe(false);
            expect(isConfigurable).toBe(false);
        });

        it('should not change the isMetaData', function () {
            function shouldThrow() {
                modelDefinition.isMetaData = true;

                if (modelDefinition.isMetaData !== true) {
                    throw new Error('');
                }
            }

            expect(modelDefinition.isMetaData).toEqual(false);
            expect(shouldThrow).toThrow();
        });
    });

    describe('createFromSchema', function () {
        var dataElementModelDefinition;

        beforeEach(function () {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a method on ModelDefinition', function () {
            expect(ModelDefinition.createFromSchema).toBeDefined();
        });

        it('should throw if the schema is not provided', function () {
            expect(ModelDefinition.createFromSchema).toThrowError('Schema should be provided');
        });

        describe('dataElementSchema', function () {
            it('should return a ModelDefinition object', function () {
                expect(dataElementModelDefinition).toEqual(jasmine.any(ModelDefinition));
            });

            it('should set the name on the definition', function () {
                expect(dataElementModelDefinition.name).toEqual('dataElement');
            });

            it('should set if it is a metadata model', function () {
                expect(dataElementModelDefinition.isMetaData).toBe(true);
            });

            it('should set metadata to false if it is not a metadata model', function () {
                var nonMetaDataModel = fixtures.get('/api/schemas/dataElement');
                nonMetaDataModel.metadata = false;

                dataElementModelDefinition = ModelDefinition.createFromSchema(nonMetaDataModel);

                expect(dataElementModelDefinition.isMetaData).toBe(false);
            });

            it('should a properties property for each of the schema properties', function () {
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).toEqual(34);
            });

            it('should not be able to modify the modelProperties array', function () {
                function shouldThrow() {
                    dataElementModelDefinition.modelProperties.anotherKey = {};

                    //TODO: There is an implementation bug in PhantomJS that does not properly freeze the array
                    if (Object.keys(dataElementModelDefinition.modelProperties).length === 34) {
                        throw new Error();
                    }
                }

                expect(shouldThrow).toThrow();
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).toEqual(34);
            });
        });

        describe('modelProperties', function () {
            var modelPropertyName;

            beforeEach(function () {
                modelPropertyName = dataElementModelDefinition.modelProperties.name;
            });

            it('should be an object', function () {
                expect(modelPropertyName).toEqual(jasmine.any(Object));
            });
        });
    });
});
/* jshint nonew:true */
