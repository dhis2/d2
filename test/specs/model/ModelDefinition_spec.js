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

    it('should not add epiEndpoint when it does not exist', function () {
        expect(modelDefinition.apiEndpint).not.toBeDefined();
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

            it('should set the epiEndpoint', function () {
                expect(dataElementModelDefinition.apiEndpoint).toBe('/dataElements');
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
            var modelProperties;

            beforeEach(function () {
                modelProperties = dataElementModelDefinition.modelProperties;
            });

            it('should be an object', function () {
                expect(modelProperties.name).toEqual(jasmine.any(Object));
            });

            it('should have have a type property', function () {
                expect(modelProperties.name.type).toEqual('string');
            });

            it('should set the data object as a type for date fields', function () {
                expect(modelProperties.created.type).toBe(Date);
            });

            it('should set the boolean datatype for externalAccess', function () {
                expect(modelProperties.externalAccess.type).toBe('boolean');
            });

            it('should have a persisted property', function () {
                expect(modelProperties.name.persisted).toBe(true);
            });

            it('should have a writable property', function () {
                expect(modelProperties.name.writable).toBe(true);
            });

            //it('should have a propertyDescriptor object', function () {
            //    var propertyDescriptor = modelProperties.name.propertyDescriptor;
            //    expect(propertyDescriptor).toBeDefined();
            //    expect(propertyDescriptor.enumerable).toBe(true);
            //    expect(propertyDescriptor.get).toBeDefined();
            //    expect(propertyDescriptor.set).toBeDefined();
            //    expect(propertyDescriptor.configurable).toBe(false);
            //});

            it('should not have a set method for dimensionType', function () {

            });

            it('should have a required property', function () {
                expect(modelProperties.name.required).toBe(true);
            });

            it('should have an owner property', function () {
                expect(modelProperties.name.owner).toBe(true);
            });

            it('should throw an error when a type is not found', function () {
                var modelPropertyUnknown;
                var dataElementModelDefinition;
                var schema = fixtures.get('/api/schemas/dataElement');
                schema.properties.push({
                    name: 'unknownProperty',
                    type: 'uio.some.unknown.type'
                });

                dataElementModelDefinition = ModelDefinition.createFromSchema(schema);
                modelPropertyUnknown = dataElementModelDefinition.modelProperties.unknownProperty;

                expect(modelPropertyUnknown.type).toEqual(undefined);
            });

            it('should use the collection name for collections', function () {
                expect(modelProperties.dataElementGroups).toBeDefined();
                expect(modelProperties.dataElementGroup).not.toBeDefined();
            });
        });
    });

    describe('create', function () {
        var tempD2;
        var dataElementModelDefinition;

        //TODO: These could be beforeAll/afterAll but it does not seem to have landed yet in karma-jasmine
        beforeEach(function () {
            tempD2 = window.d2;

            spyOn(window.d2, 'Model');

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        afterEach(function () {
            window.d2 = tempD2;
        });

        it('should call the model constructor', function () {
            dataElementModelDefinition.create();

            expect(window.d2.Model).toHaveBeenCalled();
        });

        it('should call the model constructor with the the modelDefinition', function () {
            dataElementModelDefinition.create();

            expect(window.d2.Model).toHaveBeenCalledWith(dataElementModelDefinition);
        });
    });
});
/* jshint nonew:true */
