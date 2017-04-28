/* global sinon, require, describe, beforeEach, it, expect, stub */
const proxyquire = require('proxyquire').noCallThru();

function setupFakeModelValidation() {
    const validateAgainstSchemaSpy = sinon.stub();

    class ModelValidation {
        constructor() {
            this.validateAgainstSchema = validateAgainstSchemaSpy;
        }
    }
    ModelValidation.getModelValidation = () => {
        return new ModelValidation();
    };

    proxyquire('../../../src/model/ModelBase', {
        './ModelValidation': ModelValidation,
    });

    return validateAgainstSchemaSpy;
}

describe('ModelBase', () => {
    // TODO: For some reason we have to setup the mock before the beforeEach and reset the spy, should figure out a way to perhaps do this differently.
    const validateAgainstSchemaSpy = setupFakeModelValidation();
    let modelBaseModule;
    let modelBase;
    let DIRTY_PROPERTY_LIST;

    beforeEach(() => {
        validateAgainstSchemaSpy.reset();

        modelBaseModule = require('../../../src/model/ModelBase');

        modelBase = modelBaseModule.default;
        DIRTY_PROPERTY_LIST = modelBaseModule.DIRTY_PROPERTY_LIST;
    });

    it('should have a save method', () => {
        expect(modelBase.save).to.be.a('function');
    });

    it('should have a validate method', () => {
        expect(modelBase.validate).to.be.a('function');
    });

    it('should have a clone method', () => {
        expect(modelBase.clone).to.be.a('function');
    });

    describe('saving', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                apiEndpoint: '/dataElements',
                save: stub().returns(Promise.resolve()),
                saveNew: stub().returns(Promise.resolve()),
            };

            class Model {
                constructor(modelDef) {
                    this.modelDefinition = modelDef;
                    this.validate = stub().returns(Promise.resolve({ status: true }));
                    this.dirty = true;
                    this[DIRTY_PROPERTY_LIST] = new Set(['name']);
                    this.dataValues = {};
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
            Object.defineProperty(model, 'id', {
                get() {
                    return this.dataValues.id;
                },
            });
        });

        describe('create()', () => {
            it('should call validate before calling save', () => {
                model.create();

                expect(model.validate).to.have.been.calledBefore(model.save);
            });

            it('should call saveNew on the model', () => {
                return model.create()
                    .then(() => {
                        expect(modelDefinition.saveNew).to.have.been.calledWith(model);
                    });
            });

            it('should not call saveNew when validate fails', () => {
                model.validate.returns(Promise.resolve({ status: false }));

                return model.create()
                    .catch((e) => e)
                    .then(() => {
                        expect(modelDefinition.save).to.not.be.called;
                    });
            });
        });

        describe('save()', () => {
            it('should call the save on the model modelDefinition with itself as a parameter', (done) => {
                model.save()
                    .then(() => {
                        expect(modelDefinition.save).to.have.been.calledWith(model);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should call validate before calling save', () => {
                model.save();

                expect(model.validate).to.have.been.calledBefore(model.save);
            });

            it('should not call save when validate fails', () => {
                model.validate.returns(Promise.resolve({ status: false }));

                return model.save()
                    .catch((e) => e)
                    .then(() => {
                        expect(modelDefinition.save).to.not.be.called;
                    });
            });

            it('should not call save when the model is not dirty', () => {
                model.dirty = false;

                model.save();

                expect(modelDefinition.save).to.not.be.called;
            });

            it('should reset dirty to false after save', (done) => {
                model.save()
                    .then(() => {
                        expect(model.dirty).to.be.false;
                        done();
                    }).catch((err) => {
                    done(err);
                });
            });

            it('should reset the DIRTY_PROPERTY_LIST to an empty set after save', (done) => {
                model.save()
                    .then(() => {
                        expect(model[DIRTY_PROPERTY_LIST].size).to.equal(0);
                        done();
                    }).catch((err) => {
                    done(err);
                });
            });

            it('should return a promise that resolves to an empty object when the model is not dirty', (done) => {
                model.dirty = false;

                model.save()
                    .then(result => {
                        expect(result).to.deep.equal({});
                        done();
                    })
                    .catch(done);
            });

            it('should return rejected promise when the model is not valid', (done) => {
                model.validate.returns(Promise.resolve({status: false}));

                model.save()
                    .catch((message) => {
                        expect(message).to.deep.equal({status: false});
                        done();
                    });
            });

            it('should return a promise', () => {
                expect(model.save()).to.be.instanceof(Promise);
            });

            it('should set the newly created id onto the model', () => {
                modelDefinition.save.returns(Promise.resolve({
                    httpStatus: 'Created',
                    response: {
                        uid: 'DXyJmlo9rge',
                    },
                }));

                return model.save()
                    .then(() => {
                        expect(model.id).to.equal('DXyJmlo9rge');
                    });
            });

            it('should set the correct href property onto the object', () => {
                modelDefinition.save.returns(Promise.resolve({
                    httpStatus: 'Created',
                    response: {
                        uid: 'DXyJmlo9rge',
                    },
                }));

                return model.save()
                    .then(() => {
                        expect(model.dataValues.href).to.equal('/dataElements/DXyJmlo9rge');
                    });
            });

            it('should set the dirty children\'s dirty flag back to false', () => {
                model.modelDefinition.modelValidations = {
                    organisationUnits: {
                        owner: true,
                    },
                };
                model.organisationUnits = {
                    size: 1,
                    dirty: true,
                };

                return model.save()
                    .then(() => {
                        expect(model.organisationUnits.dirty).to.be.false;
                    });
            });
        });
    });

    describe('validate', () => {
        let modelValidations;
        let model;

        beforeEach(() => {
            modelValidations = {
                age: {
                    persisted: true,
                    type: 'NUMBER',
                    required: true,
                    min: 0,
                    max: 2342,
                    owner: true,
                    unique: false,
                },
            };

            class Model {
                constructor(validations) {
                    this.modelDefinition = {};
                    this.modelDefinition.modelValidations = validations;
                    this.dataValues = {
                        age: 4,
                    };
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelValidations);

            validateAgainstSchemaSpy.returns(Promise.resolve([]));
        });

        it('should fail when the async validate fails', (done) => {
            validateAgainstSchemaSpy.returns(Promise.reject('Validation against schema endpoint failed.'));

            model.validate()
                .catch(message => {
                    expect(message).to.equal('Validation against schema endpoint failed.');
                    done();
                });
        });

        it('should call the validateAgainstSchema method on the modelValidator', (done) => {
            model.validate()
                .then(() => {
                    expect(validateAgainstSchemaSpy).to.be.called;
                    done();
                });
        });

        it('should call validateAgainstSchema with the model', (done) => {
            model.validate()
                .then(() => {
                    expect(validateAgainstSchemaSpy).to.be.calledWith(model);
                    done();
                });
        });

        it('should return false when there are the asyncValidation against the schema failed', (done) => {
            validateAgainstSchemaSpy.returns(Promise.resolve([{ message: 'Required property missing.', property: 'name' }]));

            model.validate()
                .then(validationState => {
                    expect(validationState.status).to.be.false;
                    done();
                })
                .catch(done);
        });

        it('should return false when there are the asyncValidation against the schema failed', (done) => {
            validateAgainstSchemaSpy.returns(Promise.resolve([]));

            model.validate()
                .then(validationState => {
                    expect(validationState.status).to.be.true;
                    done();
                })
                .catch(done);
        });
    });


    describe('clone', () => {
        let modelDefinition;
        let model;

        class Model {
            constructor(modelDef) {
                this.modelDefinition = modelDef;
                this.validate = stub().returns(Promise.resolve({ status: true }));
                this.dirty = false;
                this[DIRTY_PROPERTY_LIST] = new Set([]);
                this.dataValues = {
                    id: 'DXyJmlo9rge',
                    name: 'My metadata object',
                };
            }

            static create(modelDefinition) {
                const model = new Model(modelDefinition);

                Object.defineProperty(model, 'id', {
                    get() {
                        return this.dataValues.id;
                    },
                    enumerable: true,
                });
                Object.defineProperty(model, 'name', {
                    get() {
                        return this.dataValues.name;
                    },
                    set(newValue) {
                        this.dataValues.name = newValue;
                    },
                    enumerable: true,
                });
                Object.defineProperty(model, 'userGroups', {
                    get() {
                        return this.dataValues.userGroups;
                    },
                    enumerable: true,
                });

                return model;
            }
        }

        beforeEach(() => {
            modelDefinition = {
                apiEndpoint: '/dataElements',
                save: stub().returns(Promise.resolve()),
                saveNew: stub().returns(Promise.resolve()),
                create: stub().returns(Model.create(modelDefinition)),
                modelValidations: {
                    id: {},
                    name: {},
                    userGroups: {
                        type: 'COLLECTION',
                    },
                },
            };

            Model.prototype = modelBase;
            model = Model.create(modelDefinition);
        });

        it('should call create on the modelDefinition', () => {
            model.clone();

            expect(modelDefinition.create).to.be.called;
        });

        it('should pass all the dataValues to the create function', () => {
            model.clone();

            expect(modelDefinition.create).to.be.calledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
            });
        });

        it('should pass collections arrays of ids', () => {
            // Would generally be a ModelCollection, but it extends Map so for simplicity we use Map directly.
            model.dataValues.userGroups = new Map([
                ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC' }],
                ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS' }],
            ]);

            model.clone();

            expect(modelDefinition.create).to.be.calledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
                userGroups: [
                    { id: 'P3jJH5Tu5VC' },
                    { id: 'FQ2o8UBlcrS' },
                ],
            });
        });

        it('should retain all of the values in the child collections', () => {
            model.dataValues.userGroups = new Map([
                ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC', name: 'Administrators', clone() {
                    return { id: 'P3jJH5Tu5VC', name: 'Administrators' };
                } }],
                ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS', name: 'Super users', clone() {
                    return { id: 'FQ2o8UBlcrS', name: 'Super users' };
                } }],
            ]);

            model.clone();

            expect(modelDefinition.create).to.be.calledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
                userGroups: [
                    { id: 'P3jJH5Tu5VC', name: 'Administrators' },
                    { id: 'FQ2o8UBlcrS', name: 'Super users' },
                ],
            });
        });

        it('should return an independent clone', () => {
            const modelClone = model.clone();

            expect(model).not.to.equal(modelClone);

            modelClone.name = 'NewName';

            expect(modelClone.dataValues.name).to.equal('NewName');
            expect(model.dataValues.name).to.equal('My metadata object');
        });

        it('should preserve the dirty state of the original model', () => {
            model.dirty = true;
            model[DIRTY_PROPERTY_LIST] = new Set(['name']);

            const modelClone = model.clone();

            expect(modelClone.dirty).to.be.true;
        });
    });

    describe('delete', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                delete: stub().returns(new Promise((resolve) => {resolve();})),
            };

            class Model {
                constructor(modelDef) {
                    this.modelDefinition = modelDef;
                    this.validate = stub().returns(Promise.resolve({ status: true }));
                    this.dirty = true;
                    this[DIRTY_PROPERTY_LIST] = new Set(['name']);
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
        });

        it('should have a delete method', () => {
            expect(model.delete).to.be.instanceof(Function);
        });

        it('should call delete on the modeldefinition when called', () => {
            model.delete();

            expect(model.modelDefinition.delete).to.be.called;
        });

        it('should call the modelDefinition.delete method with the model', () => {
            model.delete();

            expect(model.modelDefinition.delete).to.be.calledWith(model);
        });

        it('should return a promise', () => {
            expect(model.delete()).to.be.instanceof(Promise);
        });
    });

    describe('getCollectionChildren', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        owner: true,
                    },
                    userGroups: {

                    },
                },
            };
            model.dataElements = {
                name: 'dataElements',
                dirty: true,
                size: 2,
            };

            model.userGroups = {
                name: 'userGroups',
            };
        });

        it('should return the collection children', () => {
            expect(model.getCollectionChildren()).to.contain(model.dataElements);
        });

        it('should not return the children that are not collections', () => {
            expect(model.getCollectionChildren()).not.to.contain(model.userGroups);
        });
    });

    describe('getCollectionChildrenPropertyNames', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                },
            };

            model.dataElements = [];
        });

        it('should return the correct property collections', () => {
            expect(model.getCollectionChildrenPropertyNames()).to.contain('dataElements');
        });

        it('should not return the collection for the property if there is no modelValidation for the property', () => {
            model.indicators = [];

            expect(model.getCollectionChildrenPropertyNames()).not.to.contain('indicators');
        });

        it('should not return the collection for the property if there is no modelValidation for the property', () => {
            model.modelDefinition.modelValidations.indicators = {
                type: 'COLLECTION',
            };

            expect(model.getCollectionChildrenPropertyNames()).not.to.contain('indicators');
        });
    });

    describe('getReferenceProperties', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                        embeddedObject: false,
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                    user: {
                        type: 'REFERENCE',
                        embeddedObject: false,
                    },
                    accesses: {
                        type: 'REFERENCE',
                        embeddedObject: true,
                    },
                },
            };

            model.dataElements = [];
            model.user = {
                id: 'xE7jOejl9FI',
                firstName: 'John',
            };
            model.accesses = {
                read: true,
                write: true,
            };
        });

        it('should return the correct reference properties', () => {
            expect(model.getReferenceProperties()).to.contain('user');
        });

        it('should not return the reference property if there is no modelValidation for the property', () => {
            model.randomObject = {};

            expect(model.getReferenceProperties()).not.to.contain('randomObject');
        });

        it('should not return the reference property if there is no value for the property', () => {
            model.modelDefinition.modelValidations.randomObject = {
                type: 'REFERENCE',
            };

            expect(model.getReferenceProperties()).not.to.contain('randomObject');
        });

        it('should not return the property if the reference property is embedded', () => {
            expect(model.getReferenceProperties()).not.to.contain('accesses');
        });
    });

    describe('getEmbeddedObjectCollectionPropertyNames', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                        embeddedObject: false,
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                    legends: {
                        type: 'COLLECTION',
                        embeddedObject: true,
                    },
                },
            };

            model.dataElements = [];
            model.legends = [];
        });

        it('should include the embedded collection', () => {
            expect(model.getEmbeddedObjectCollectionPropertyNames()).to.contain('legends');
        });

        it('should not include non embedded object collections', () => {
            expect(model.getEmbeddedObjectCollectionPropertyNames()).not.to.contain('dataElements');
        });
    });

    describe('getDirtyChildren', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        owner: true,
                    },
                },
            };
            model.dataElements = {
                name: 'dataElements',
                dirty: true,
                size: 2,
            };
        });

        it('should return the dirty children properties', () => {
            expect(model.getDirtyChildren()).to.deep.equal([model.dataElements]);
        });
    });

    describe('toJSON', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    name: {
                        owner: true,
                    },
                    dataElements: {
                        owner: true,
                        type: 'COLLECTION',
                    },
                },
            };
            model.dataValues = {
                name: 'ANC',
                dataElements: new Map([
                    ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC', name: 'anc1' }],
                    ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS', name: 'anc2' }],
                ]),
            };

            model.name = model.dataValues.name;
            model.dataElements = model.dataValues.dataElements;
        });

        it('should be a function', () => {
            expect(model.toJSON).to.be.a('function');
        });

        it('should return a json representation of the model', () => {
            const expected = ({
                name: 'ANC',
                dataElements: [
                    { id: 'P3jJH5Tu5VC' },
                    { id: 'FQ2o8UBlcrS' },
                ],
            });

            expect(model.toJSON()).to.deep.equal(expected);
        });
    });
});
