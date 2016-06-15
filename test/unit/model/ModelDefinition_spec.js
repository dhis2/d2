let proxyquire = require('proxyquire').noCallThru();

function ModelCollection() {}
ModelCollection.create = sinon.stub().returns(new ModelCollection());

function ModelCollectionProperty() {}
ModelCollectionProperty.create = sinon.stub().returns(new ModelCollectionProperty());

proxyquire('../../../src/model/ModelDefinition', {
    './ModelCollection': ModelCollection,
    './ModelCollectionProperty': ModelCollectionProperty,
});

import fixtures from '../../fixtures/fixtures';
import { DIRTY_PROPERTY_LIST } from '../../../src/model/ModelBase';
import Model from '../../../src/model/Model';
import ModelDefinitions from '../../../src/model/ModelDefinitions';

// TODO: Can not use import here as babel will not respect the override
let ModelDefinition = require('../../../src/model/ModelDefinition');

describe('ModelDefinition', () => {
    'use strict';

    var modelDefinition;

    beforeEach(() => {
        ModelCollection.create.reset();
        ModelCollectionProperty.create.reset();

        modelDefinition = new ModelDefinition('dataElement', 'dataElements');
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelDefinition()).to.throw('Cannot call a class as a function');
    });

    it('should create a ModelDefinition object', () => {
        expect(modelDefinition).to.be.instanceof(ModelDefinition);
    });

    it('should not add epiEndpoint when it does not exist', () => {
        expect(modelDefinition.apiEndpoint).to.be.undefined;
    });

    it('should throw an error when a name is not specified', () => {
        function shouldThrow() {
            new ModelDefinition();
        }
        expect(shouldThrow).to.throw('Value should be provided');
    });

    it('should throw if the name is not a string', () => {
        function shouldThrow() {
            new ModelDefinition({});
        }
        expect(shouldThrow).to.throw('Expected [object Object] to have type string');
    });

    it('should throw an error when plural is not specified', () => {
        function shouldThrow() {
            new ModelDefinition('dataElement');
        }
        expect(shouldThrow).to.throw('Plural should be provided');
    });

    describe('instance', () => {
        it('should not be able to change the name', () => {
            var isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').writable;
            var isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').configurable;

            expect(isWritable).to.be.false;
            expect(isConfigurable).to.be.false;
        });

        it('should not change the name', () => {
            function shouldThrow() {
                modelDefinition.name = 'anotherName';

                if (modelDefinition.name !== 'anotherName') {
                    throw new Error('');
                }
            }

            expect(modelDefinition.name).to.equal('dataElement');
            expect(shouldThrow).to.throw();
        });

        it('should not be able to change the isMetaData', () => {
            const isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').writable;
            const isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').configurable;

            expect(isWritable).to.be.false;
            expect(isConfigurable).to.be.false;
        });

        it('should not change the isMetaData', () => {
            function shouldThrow() {
                modelDefinition.isMetaData = true;

                if (modelDefinition.isMetaData !== true) {
                    throw new Error('');
                }
            }

            expect(modelDefinition.isMetaData).to.equal(false);
            expect(shouldThrow).to.throw();
        });
    });

    describe('createFromSchema', () => {
        var dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'), fixtures.get('/api/attributes').attributes);
        });

        it('should be a method on ModelDefinition', () => {
            expect(ModelDefinition.createFromSchema).to.not.be.undefined;
        });

        it('should throw if the schema is not provided', () => {
            expect(ModelDefinition.createFromSchema).to.throw('Schema should be provided');
        });

        describe('dataElementSchema', () => {
            it('should return a ModelDefinition object', () => {
                expect(dataElementModelDefinition).to.be.instanceof(ModelDefinition);
            });

            it('should set the name on the definition', () => {
                expect(dataElementModelDefinition.name).to.equal('dataElement');
            });

            it('should set if it is a metadata model', () => {
                expect(dataElementModelDefinition.isMetaData).to.be.true;
            });

            it('should set the epiEndpoint', () => {
                expect(dataElementModelDefinition.apiEndpoint).to.equal('/dataElements');
            });

            it('should set metadata to false if it is not a metadata model', () => {
                var nonMetaDataModel = fixtures.get('/api/schemas/dataElement');
                nonMetaDataModel.metadata = false;

                dataElementModelDefinition = ModelDefinition.createFromSchema(nonMetaDataModel);

                expect(dataElementModelDefinition.isMetaData).to.be.false;
            });

            it('should a properties property for each of the schema properties', () => {
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).to.equal(39);
            });

            it('should not be able to modify the modelProperties array', () => {
                function shouldThrow() {
                    dataElementModelDefinition.modelProperties.anotherKey = {};

                    //TODO: There is an implementation bug in PhantomJS that does not properly freeze the array
                    if (Object.keys(dataElementModelDefinition.modelProperties).length === 39) {
                        throw new Error();
                    }
                }

                expect(shouldThrow).to.throw();
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).to.equal(39);
            });
        });

        describe('modelProperties', () => {
            var modelProperties;

            beforeEach(() => {
                modelProperties = dataElementModelDefinition.modelProperties;
            });

            it('should be an object', () => {
                expect(modelProperties.name).to.be.instanceof(Object);
            });

            it('should throw an error when a type is not found', () => {
                const schema = fixtures.get('/api/schemas/dataElement');
                let dataElementModelDefinition;

                function shouldThrow() {
                    dataElementModelDefinition = ModelDefinition.createFromSchema(schema);
                }

                schema.properties.push({
                    name: 'unknownProperty',
                    propertyType: 'uio.some.unknown.type',
                });

                expect(shouldThrow).to.throw('Type from schema "uio.some.unknown.type" not found available type list.');
            });

            it('should not add properties that do not have a name', () => {
                const schema = fixtures.get('/api/schemas/dataElement');
                const expectedProperties = [
                    'aggregationLevels',
                    'zeroIsSignificant',
                    'displayDescription',
                    'dimensionType',
                    'type',
                    'dataDimension',
                    'optionSet',
                    'id',
                    'created',
                    'description',
                    'displayFormName',
                    'commentOptionSet',
                    'name',
                    'externalAccess',
                    'textType',
                    'href',
                    'dataElementGroups',
                    'publicAccess',
                    'aggregationOperator',
                    'formName',
                    'lastUpdated',
                    'dataSets',
                    'code',
                    'access',
                    'url',
                    'numberType',
                    'domainType',
                    'legendSet',
                    'categoryCombo',
                    'dimension',
                    'attributeValues',
                    'items',
                    'optionSetValue',
                    'userGroupAccesses',
                    'shortName',
                    'displayName',
                    'displayShortName',
                    'user',
                    'filter',
                ];

                schema.properties.push({propertyType: 'TEXT'});

                const definition = ModelDefinition.createFromSchema(schema);

                expect(Object.keys(definition.modelProperties)).to.deep.equal(expectedProperties);
            });

            it('should use the collection name for collections', () => {
                expect(modelProperties.dataElementGroups).to.not.be.undefined;
                expect(modelProperties.dataElementGroup).to.be.undefined;
            });

            it('should add a get method to the propertyDescriptor', () => {
                expect(modelProperties.name.get).to.be.instanceof(Function);
            });

            it('should add a set method to the propertyDescriptor for name', () => {
                expect(modelProperties.name.set).to.be.instanceof(Function);
            });

            it('should not have a set method for dimensionType', () => {
                expect(modelProperties.dimensionType.set).not.to.be.instanceof(Function);
            });

            it('should create getter function on the propertyDescriptor', () => {
                const model = {
                    dataValues: {
                        name: 'Mark',
                    },
                };

                expect(modelProperties.name.get.call(model)).to.equal('Mark');
            });

            it('should create setter function on the propertyDescriptor', () => {
                const model = {
                    dataValues: {},
                };
                model[DIRTY_PROPERTY_LIST] = new Set([]);

                modelProperties.name.set.call(model, 'James');

                expect(model.dataValues.name).to.equal('James');
            });

            describe('setter', () => {
                let model;

                beforeEach(() => {
                    model = {
                        dirty: false,
                        dataValues: {},
                    };

                    model[DIRTY_PROPERTY_LIST] = new Set([]);
                });

                it('should set the dirty property to true when a value is set', () => {
                    modelProperties.name.set.call(model, 'James');

                    expect(model.dirty).to.be.true;
                });

                it('should not set the dirty property to true when the value is the same', () => {
                    model.dataValues.name = 'James';
                    modelProperties.name.set.call(model, 'James');

                    expect(model.dirty).to.be.false;
                });

                it('should set the dirty property when a different object is added', () => {
                    model.dataValues.name = { name: 'James' };
                    modelProperties.name.set.call(model, { name: 'James', last: 'Doe' });

                    expect(model.dirty).to.be.true;
                });
            });
        });

        describe('modelValidations', () => {
            let modelValidations;

            beforeEach(() => {
                modelValidations = dataElementModelDefinition.modelValidations;
            });

            describe('created', () => {
                it('should set the data object as a type for date fields', () => {
                    expect(modelValidations.created.type).to.equal('DATE');
                });

                it('should be owned by this schema', () => {
                    expect(modelValidations.created.owner).to.be.true;
                });
            });

            describe('externalAccess', () => {
                it('should set the boolean datatype for externalAccess', () => {
                    expect(modelValidations.externalAccess.type).to.equal('BOOLEAN');
                });

                it('should not be owned by this schema', () => {
                    expect(modelValidations.externalAccess.owner).to.be.false;
                });

                // TODO: This currently has some sort of max value
                // it('should not have a maxLength property', () => {
                //    expect(modelValidations.externalAccess.maxLength).toBe(undefined);
                // });
            });

            describe('id', () => {
                it('should have a maxLength', () => {
                    expect(modelValidations.id.max).to.equal(11);
                });
            });

            describe('name', () => {
                it('should have have a type property', () => {
                    expect(modelValidations.name.type).to.equal('TEXT');
                });

                it('should have a persisted property', () => {
                    expect(modelValidations.name.persisted).to.be.true;
                });

                it('should have a required property', () => {
                    expect(modelValidations.name.required).to.be.true;
                });

                it('should have an owner property', () => {
                    expect(modelValidations.name.owner).to.be.true;
                });
            });

            describe('domainType', () => {
                it('should have loaded the constants', () => {
                    expect(modelValidations.domainType.constants).to.deep.equal(['AGGREGATE', 'TRACKER']);
                });
            });

            it('should add the referenceType to the optionSet and commentOptionSet', () => {
                expect(modelValidations.commentOptionSet.referenceType).to.equal('optionSet');
                expect(modelValidations.optionSet.referenceType).to.equal('optionSet');
            });

            it('should add the referenceType to the categoryCombo property', () => {
                expect(modelValidations.categoryCombo.referenceType).to.equal('categoryCombo');
            });

            it('should add the referenceType to the user property', () => {
                expect(modelValidations.user.referenceType).to.equal('user');
            });

            it('should not add a referenceType for a property that are not a reference', () => {
                expect(modelValidations.name.referenceType).to.be.undefined;
            });

            describe('ordered', () => {
                it('should set ordered to false when the property is not available', () => {
                    expect(modelValidations.name.ordered).to.be.false;
                });

                it('should set ordered to false when the ordered property is available and is false', () => {
                    const dataElementSchemaFixture = fixtures.get('/api/schemas/dataElement');
                    dataElementSchemaFixture.properties[0].ordered = false;

                    dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchemaFixture, fixtures.get('/api/attributes').attributes);

                    modelValidations = dataElementModelDefinition.modelValidations;

                    expect(modelValidations.aggregationLevels.ordered).to.be.false;
                });

                it('should set ordered to true when the ordered property is available and is true', () => {
                    const dataElementSchemaFixture = fixtures.get('/api/schemas/dataElement');
                    dataElementSchemaFixture.properties[0].ordered = true;

                    dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchemaFixture, fixtures.get('/api/attributes').attributes);

                    modelValidations = dataElementModelDefinition.modelValidations;

                    expect(modelValidations.aggregationLevels.ordered).to.be.true;
                });
            });

            describe('collection reference', () => {
                let indicatorGroupModelDefinition;
                let modelValidations;

                beforeEach(() => {
                    indicatorGroupModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/indicatorGroup'));
                    modelValidations = indicatorGroupModelDefinition.modelValidations;
                });

                it('should add a reference type for a collection of references', () => {
                    expect(modelValidations.indicators.referenceType).to.equal('indicator');
                });

                it('should not add a reference type for a collection of complex objects', () => {
                    expect(modelValidations.userGroupAccesses.referenceType).to.be.undefined;
                });
            });
        });

        describe('specialized definitions', () => {
            let UserModelDefinition;
            let userModelDefinition;

            let DataSetModelDefinition;
            let dataSetModelDefinition;

            beforeEach(() => {
                UserModelDefinition = require('../../../src/model/ModelDefinition').specialClasses.user;
                userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

                DataSetModelDefinition = require('../../../src/model/ModelDefinition').specialClasses.dataSet;
                dataSetModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataSet'));
            });

            it('should return a UserModelDefinition for the user schema', () => {
                expect(userModelDefinition).to.be.instanceof(UserModelDefinition);
            });

            it('should return a DataSetModelDefinition for the data set schema', () => {
                expect(dataSetModelDefinition).to.be.instanceof(DataSetModelDefinition);
            })
        });

        describe('attribute properties', () => {
            let attributeProperties;

            beforeEach(() => {
                attributeProperties = dataElementModelDefinition.attributeProperties;
            });

            it('should have added the attribute properties onto the model', () => {
                expect(attributeProperties).to.not.be.undefined;
            });

            it('should be descriptor objects', () => {
                expect(attributeProperties.name).to.be.instanceof(Object);
            });
        });
    });

    describe('create()', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        // TODO: This is currently not a pure unit test as we haven't mocked out Model
        it('should return an instance of Model', () => {
            expect(dataElementModelDefinition.create()).to.be.instanceof(Model);
        });

        describe('with default values', () => {
            const organisationUnitGroupSetModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/organisationUnitGroupSet'));
            let model;

            beforeEach(() => {
                model = organisationUnitGroupSetModelDefinition.create();
            });

            it('should set the default data dimension', () => {
                expect(model.dataDimension).to.be.true;
            });
        });

        describe('collection properties', () => {
            let orgunitModelDefinition;
            let userModelDefinition;
            let model;

            beforeEach(() => {
                userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));
                orgunitModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/organisationUnit'));

                // TODO: Mock the ModelDefinitions singleton, so we can get rid of this logic
                if (!ModelDefinitions.getModelDefinitions().user) {
                    ModelDefinitions.getModelDefinitions().add(userModelDefinition);
                }
                if (!ModelDefinitions.getModelDefinitions().organisationUnit) {
                    ModelDefinitions.getModelDefinitions().add(orgunitModelDefinition);
                }
            });

            describe('with data', () => {
                beforeEach(() => {
                    model = userModelDefinition.create({
                        organisationUnits: [
                            {name: 'Kenya', id: 'FTRrcoaog83'},
                            {name: 'Oslo', id: 'P3jJH5Tu5VC'},
                        ],
                    });
                });

                it('should create a ModelCollectionProperty.create for a collection of objects', () => {
                    expect(ModelCollectionProperty.create).to.have.callCount(1);
                });

                it('should create a ModelCollectionProperty with the correct values', () => {
                    const modelDefinitionForCollection = ModelCollectionProperty.create.getCall(0).args[1];
                    const modelCollectionData = ModelCollectionProperty.create.getCall(0).args[2];
                    const passedModelInstance = ModelCollectionProperty.create.getCall(0).args[0];

                    // First argument to ModelCollectionPrototype.create
                    expect(passedModelInstance).to.equal(model);

                    // Second argument to ModelCollectionProperty.create
                    expect(modelDefinitionForCollection.name).to.equal(orgunitModelDefinition.name);
                    expect(modelDefinitionForCollection.plural).to.equal(orgunitModelDefinition.plural);

                    // Third argument to ModelCollectionProperty.create
                    expect(modelCollectionData[0]).to.deep.equal(orgunitModelDefinition.create({name: 'Kenya', id: 'FTRrcoaog83'}));
                    expect(modelCollectionData[1]).to.deep.equal(orgunitModelDefinition.create({name: 'Oslo', id: 'P3jJH5Tu5VC'}));
                });
            });

            describe('without data', () => {
                beforeEach(() => {
                    model = userModelDefinition.create();
                });

                it('should create a ModelCollectionProperty.create for a collection of objects', () => {
                    expect(ModelCollectionProperty.create).to.have.callCount(3);
                });

                it('should create a ModelCollectionProperty without data', () => {
                    const passedModelInstance = ModelCollectionProperty.create.getCall(0).args[0];
                    const modelDefinitionForCollection = ModelCollectionProperty.create.getCall(0).args[1];
                    const modelCollectionData = ModelCollectionProperty.create.getCall(0).args[2];

                    // First argument to ModelCollectionPrototype.create
                    expect(passedModelInstance).to.equal(model);

                    // Second argument to ModelCollectionProperty.create
                    expect(modelDefinitionForCollection.name).to.equal(orgunitModelDefinition.name);
                    expect(modelDefinitionForCollection.plural).to.equal(orgunitModelDefinition.plural);

                    // Third argument to ModelCollectionProperty.create
                    expect(modelCollectionData).to.deep.equal([]);
                });
            });
        });
    });

    describe('get', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: stub().returns(new Promise((resolve) => {
                    resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
                })),
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should throw an error when the given id is not a string', () => {
            function shouldThrow() {
                dataElementModelDefinition.get();
            }

            expect(shouldThrow).to.throw('Identifier should be provided');
        });

        it('should return a promise', () => {
            const modelPromise = dataElementModelDefinition
                .get('d4343fsss');

            expect(modelPromise.then).to.be.instanceof(Function);
        });

        it('should call the api for the requested id', () => {
            dataElementModelDefinition.get('d4343fsss');

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements/d4343fsss', { fields: ':all,attributeValues[:all,attribute[id,name,displayName]]' });
        });

        it('should set the data onto the model when it is available', (done) => {
            dataElementModelDefinition.get('d4343fsss')
                .then((dataElementModel) => {
                    expect(dataElementModel.name).to.equal('BS_COLL (N, DSD) TARGET: Blood Units Donated');
                    done();
                });
        });

        it('should reject the promise with the message when the request fails', (done) => {
            ModelDefinition.prototype.api.get = stub().returns(Promise.reject({
                    httpStatus: 'Not Found',
                    httpStatusCode: 404,
                    status: 'ERROR',
                    message: 'DataElementCategory with id sdfsf could not be found.',
                })
            );

            dataElementModelDefinition.get('d4343fsss')
                .then(done)
                .catch((dataElementError) => {
                    expect(dataElementError).to.equal('DataElementCategory with id sdfsf could not be found.');
                    done();
                });
        });

        it('should reject with the promise payload when no message was returned', () => {
            const responsePayload = '500 error string';

            ModelDefinition.prototype.api.get = stub().returns(Promise.reject(responsePayload));

            return dataElementModelDefinition.get('d4343fsss')
                .catch((dataElementError) => {
                    expect(dataElementError).to.equal(responsePayload);
                });
        });

        describe('multiple', () => {
            it('should return a ModelCollection object', (done) => {
                const dataElementsResult = fixtures.get('/api/dataElements');
                ModelDefinition.prototype.api.get = stub().returns(Promise.resolve(dataElementsResult));

                dataElementModelDefinition.get(['id1', 'id2'])
                    .then((dataElementCollection) => {
                        expect(dataElementCollection).to.be.instanceof(ModelCollection);
                        done();
                    })
                    .catch(done);
            });

            it('should call the api with the in filter', (done) => {
                const dataElementsResult = fixtures.get('/api/dataElements');
                ModelDefinition.prototype.api.get = stub().returns(Promise.resolve(dataElementsResult));

                dataElementModelDefinition.get(['id1', 'id2'])
                    .then((dataElementCollection) => {
                        expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { filter: ['id:in:[id1,id2]'], fields: ':all' });
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('list', () => {
        let dataElementsResult = fixtures.get('/api/dataElements');
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: stub().returns(new Promise((resolve) => {
                    resolve(dataElementsResult);
                }))
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a function', () => {
            expect(dataElementModelDefinition.list).to.be.instanceof(Function);
        });

        it('should call the get method on the api', () => {
            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).to.be.called;
        });

        it('should return a promise', () => {
            expect(dataElementModelDefinition.list()).to.be.instanceof(Promise);
        });

        it('should call the get method on the api with the endpoint of the model', () => {
            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all' });
        });

        it('should return a model collection object', (done) => {
            dataElementModelDefinition.list()
                .then((dataElementCollection) => {
                    expect(dataElementCollection).to.be.instanceof(ModelCollection);
                    done();
                })
                .catch(done);
        });

        it('should not call the model collection create function with new', (done) => {
            dataElementModelDefinition.list()
                .then(() => {
                    expect(ModelCollection.create).to.not.be.calledWithNew;
                    done();
                })
                .catch(done);
        });

        it('should call the model collection constructor with the correct data', (done) => {
            dataElementModelDefinition.list()
                .then(() => {
                    let firstCallArguments = ModelCollection.create.getCall(0).args;

                    expect(firstCallArguments[0]).to.equal(dataElementModelDefinition);
                    expect(firstCallArguments[1].length).to.equal(5);
                    expect(firstCallArguments[2]).to.equal(dataElementsResult.pager);

                    done();
                })
                .catch(done);
        });

        it('should call the api get method with the correct parameters after filters are set', () => {
            dataElementModelDefinition
                .filter().on('name').like('John')
                .list();

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all', filter: ['name:like:John'] });
        });

        it('should return a separate modelDefinition when filter is called', () => {
            expect(dataElementModelDefinition.filter).not.to.equal(dataElementModelDefinition);
        });

        it('should not influence the list method of the default modelDefinition', () => {
            dataElementModelDefinition
                .filter().on('name').like('John')
                .list();

            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all' });
            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all', filter: ['name:like:John'] });
        });

        it('should support multiple filters', () => {
            dataElementModelDefinition
                .filter().on('name').like('John')
                .filter().on('username').equals('admin')
                .list();

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all', filter: ['name:like:John', 'username:eq:admin'] });
        });
    });

    describe('clone', () => {
        let dataElementsResult = fixtures.get('/api/dataElements');
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: stub().returns(new Promise((resolve) => {
                    resolve(dataElementsResult);
                }))
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a method', () => {
            expect(dataElementModelDefinition.clone).to.be.instanceof(Function);
        });

        it('should return a cloned modelDefinition', () => {
            expect(dataElementModelDefinition.clone()).not.to.equal(dataElementModelDefinition);
        });

        it('should deep equal the creator', () => {
            let clonedDefinition = dataElementModelDefinition.clone();

            expect(clonedDefinition.name).to.equal(dataElementModelDefinition.name);
            expect(clonedDefinition.plural).to.equal(dataElementModelDefinition.plural);
            expect(clonedDefinition.isMetaData).to.equal(dataElementModelDefinition.isMetaData);
            expect(clonedDefinition.apiEndpoint).to.equal(dataElementModelDefinition.apiEndpoint);
            expect(clonedDefinition.modelProperties).to.equal(dataElementModelDefinition.modelProperties);
        });

        it('should not have reset the filter', () => {
            let clonedDefinition = dataElementModelDefinition.clone();

            expect(clonedDefinition.filters).not.to.equal(dataElementModelDefinition.filters);
        });

        it('should still work like normal modelDefinition', () => {
            let clonedDefinition = dataElementModelDefinition.clone();

            clonedDefinition.list();

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements', { fields: ':all' });
        });
    });

    describe('save()', () => {
        let apiUpdateStub;
        let apiPostStub;
        let model;
        let userModelDefinition;

        beforeEach(() => {
            let singleUserAllFields = fixtures.get('singleUserAllFields');

            apiUpdateStub = stub().returns(new Promise((resolve) => {
                resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
            }));
            apiPostStub = stub().returns(new Promise((resolve) => {
                resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
            }));

            ModelDefinition.prototype.api = {
                update: apiUpdateStub,
                post: apiPostStub
            };

            userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

            class Model {
                constructor() {
                    this.dataValues = {};
                    this[DIRTY_PROPERTY_LIST] = new Set([]);
                    this.getCollectionChildrenPropertyNames = stub().returns([]);
                }
            }
            model = new Model();

            Object.keys(singleUserAllFields).forEach((key) => {
                model.dataValues[key] = singleUserAllFields[key];
                model[key] = singleUserAllFields[key];
            });
        });

        it('should be a method that returns a promise', () => {
            expect(userModelDefinition.save(model)).to.be.instanceof(Promise);
        });

        it('should call the update method on the api', () => {
            userModelDefinition.save(model);

            expect(apiUpdateStub).to.be.called;
        });

        it('should pass only the properties that are owned to the api', () => {
            let expectedPayload = fixtures.get('singleUserOwnerFields');

            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1]).to.deep.equal(expectedPayload);
        });

        it('should let a falsy value pass as an owned property', () => {
            let expectedPayload = fixtures.get('singleUserOwnerFields');
            expectedPayload.surname = '';

            model.dataValues.surname = '';
            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1].surname).to.deep.equal(expectedPayload.surname);
        });

        it('should not let undefined pass as a value', () => {
            let expectedPayload = fixtures.get('singleUserOwnerFields');
            delete expectedPayload.surname;

            model.dataValues.surname = undefined;
            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1].surname).to.deep.equal(expectedPayload.surname);
        });

        it('should not let null pass as a value', () => {
            let expectedPayload = fixtures.get('singleUserOwnerFields');
            delete expectedPayload.surname;

            model.dataValues.surname = null;
            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1].surname).to.deep.equal(expectedPayload.surname);
        });

        it('should save to the url set on the model', () => {
            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[0]).to.equal(fixtures.get('singleUserAllFields').href);
        });

        it('should call the update method on the api with the replace strategy option set to true', () => {
            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[2]).to.be.true;
        });

        it('should save a new object using a post', () => {
            // Objects without id are concidered "new"
            delete model.id;

            userModelDefinition.save(model);

            expect(apiPostStub).to.be.called;
        });

        it('should translate a collection property to an array of ids', () => {
            model.getCollectionChildrenPropertyNames.returns(['organisationUnits']);
            model.dataValues.organisationUnits = new Set([
                {name: 'Kenya', id: 'FTRrcoaog83'},
                {name: 'Oslo', id: 'P3jJH5Tu5VC'},
            ]);

            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1].organisationUnits).to.deep.equal([{id: 'FTRrcoaog83'}, {id: 'P3jJH5Tu5VC'}]);
        });

        it('should not add invalid objects that do not have an id', () => {
            model.getCollectionChildrenPropertyNames.returns(['organisationUnits']);
            model.dataValues.organisationUnits = new Set([
                {name: 'Kenya'},
                {name: 'Oslo', id: 'P3jJH5Tu5VC'},
            ]);

            userModelDefinition.save(model);

            expect(apiUpdateStub.getCall(0).args[1].organisationUnits).to.deep.equal([{id: 'P3jJH5Tu5VC'}]);
        });
    });

    describe('delete', () => {
        let apiDeleteStub;
        let model;
        let userModelDefinition;

        beforeEach(() => {
            const singleUserAllFields = fixtures.get('singleUserAllFields');

            apiDeleteStub = stub().returns(new Promise((resolve) => {
                resolve();
            }));

            ModelDefinition.prototype.api = {
                delete: apiDeleteStub,
            };

            userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

            class Model {
                constructor() {
                    this.dataValues = {};
                    this.modelDefinition = userModelDefinition;
                    this[DIRTY_PROPERTY_LIST] = new Set([]);
                }
            }
            model = new Model();

            Object
                .keys(singleUserAllFields)
                .forEach((key) => {
                    model.dataValues[key] = singleUserAllFields[key];
                    model[key] = singleUserAllFields[key];
                });
        });

        it('should call the delete method on the api', () => {
            userModelDefinition.delete(model);

            expect(apiDeleteStub).to.be.called;
        });

        it('should call delete with the url', () => {
            userModelDefinition.delete(model);

            expect(apiDeleteStub).to.be.calledWith(model.href);
        });

        it('should return a promise', () => {
            expect(userModelDefinition.delete(model)).to.be.instanceof(Promise);
        });

        it('should create the url from the endpoint and model.id when the href is not available', () => {
            model.dataValues.href = undefined;

            userModelDefinition.delete(model);

            expect(apiDeleteStub).to.be.calledWith('http://localhost:8080/dhis/api/users/aUplAx3DOWy');
        });
    });

    describe('getOwnedPropertyNames', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should return only the owned properties', () => {
            const expectedDataElementProperties = [
                'lastUpdated', 'code', 'id', 'created', 'name', 'formName', 'legendSet',
                'shortName', 'zeroIsSignificant', 'publicAccess', 'commentOptionSet',
                'aggregationOperator', 'type', 'url', 'numberType', 'optionSet',
                'domainType', 'description', 'categoryCombo', 'user', 'textType',
                'aggregationLevels', 'attributeValues', 'userGroupAccesses',
            ].sort();
            const ownProperties = dataElementModelDefinition.getOwnedPropertyNames();

            expect(ownProperties.sort()).to.deep.equal(expectedDataElementProperties);
        });
    });
});

describe('ModelDefinition subsclasses', () => {
    let ModelDefinition;
    let getOnApiStub;

    beforeEach(() => {
        getOnApiStub = stub().returns(Promise.resolve());
        ModelDefinition = require('../../../src/model/ModelDefinition');

        ModelDefinition.prototype.api = {
            get: getOnApiStub,
        };
    });

    describe('UserModelDefinition', () => {
        let UserModelDefinition;
        let userModelDefinition;

        beforeEach(() => {
            UserModelDefinition = ModelDefinition.specialClasses.user;

            userModelDefinition = new UserModelDefinition('user', 'users', {}, {}, {});
        });

        it('should be instance of Model', () => {
            expect(userModelDefinition).to.be.instanceof(ModelDefinition);
        });

        it('should call the get function with the extra parameters', function () {
            userModelDefinition.get('myUserId');

            expect(getOnApiStub).to.be.calledWith('/myUserId', { fields: ':all,userCredentials[:owner]' });
        });
    });
});
