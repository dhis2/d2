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

            it('should throw an error when a type is not found', function () {
                var dataElementModelDefinition;
                var schema = fixtures.get('/api/schemas/dataElement');
                schema.properties.push({
                    name: 'unknownProperty',
                    propertyType: 'uio.some.unknown.type'
                });
                function shouldThrow() {
                    dataElementModelDefinition = ModelDefinition.createFromSchema(schema);
                }

                expect(shouldThrow).toThrowError('Type from schema "uio.some.unknown.type" not found available type list.');
            });

            it('should use the collection name for collections', function () {
                expect(modelProperties.dataElementGroups).toBeDefined();
                expect(modelProperties.dataElementGroup).not.toBeDefined();
            });

            it('should add a get method to the propertyDescriptor', function () {
                expect(modelProperties.name.get).toEqual(jasmine.any(Function));
            });

            it('should add a set method to the propertyDescriptor for name', function () {
                expect(modelProperties.name.set).toEqual(jasmine.any(Function));
            });

            it('should not have a set method for dimensionType', function () {

            });

            it('should create getter function on the propertyDescriptor', function () {
                var model = {
                    dataValues: {
                        name: 'Mark'
                    }
                };

                expect(modelProperties.name.get.call(model)).toBe('Mark');
            });

            it('should create setter function on the propertyDescriptor', function () {
                var model = {
                    dataValues: {

                    }
                };

                modelProperties.name.set.call(model, 'James');

                expect(model.dataValues.name).toBe('James');
            });
        });

        describe('modelValidations', function () {
            var modelValidations;

            beforeEach(function () {
                modelValidations = dataElementModelDefinition.modelValidations;
            });

            describe('created', function () {
                it('should set the data object as a type for date fields', function () {
                    expect(modelValidations.created.type).toBe('DATE');
                });

                it('should be owned by this schema', function () {
                    expect(modelValidations.created.owner).toBe(true);
                });
            });

            describe('externalAccess', function () {
                it('should set the boolean datatype for externalAccess', function () {
                    expect(modelValidations.externalAccess.type).toBe('BOOLEAN');
                });

                it('should not be owned by this schema', function () {
                    expect(modelValidations.externalAccess.owner).toBe(false);
                });

                //TODO: This currently has some sort of max value
                //it('should not have a maxLength property', function () {
                //    expect(modelValidations.externalAccess.maxLength).toBe(undefined);
                //});
            });

            describe('name', function () {
                it('should have have a type property', function () {
                    expect(modelValidations.name.type).toEqual('TEXT');
                });

                it('should have a maxLength', function () {
                    expect(modelValidations.name.max).toBe(230);
                });

                it('should have a persisted property', function () {
                    expect(modelValidations.name.persisted).toBe(true);
                });

                it('should have a required property', function () {
                    expect(modelValidations.name.required).toBe(true);
                });

                it('should have an owner property', function () {
                    expect(modelValidations.name.owner).toBe(true);
                });
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

    describe('get', function () {
        var dataElementModelDefinition;

        //TODO: These could be beforeAll/afterAll but it does not seem to have landed yet in karma-jasmine
        beforeEach(function () {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should throw an error when the given id is not a string', function () {
            function shouldThrow() {
                dataElementModelDefinition.get();
            }

            expect(shouldThrow).toThrowError('Identifier should be provided');
        });

        it('should return a promise', function () {
            var modelPromise = dataElementModelDefinition
                .get('d4343fsss');

            expect(modelPromise.then).toEqual(jasmine.any(Function));
        });
    });
});
/* jshint nonew:true */
