function setupFakeModelValidation() {
    const validateAgainstSchemaSpy = sinon.stub();
    const proxyquire = require('proxyquire').noCallThru();

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
        expect(modelBase.save).to.be.instanceof(Function);
    });

    it('should have a validate method', () => {
        expect(modelBase.validate).to.be.instanceof(Function);
    });

    describe('save()', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                apiEndpoint: '/dataElements',
                save: stub().returns(Promise.resolve()),
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
            model.validate.returns({ status: false });

            expect(modelDefinition.save).to.not.be.called;
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

        it('should return rejected promise when the model is not dirty', (done) => {
            model.dirty = false;

            model.save()
                .catch((message) => {
                    expect(message).to.equal('No changes to be saved');
                    done();
                });
        });

        it('should return rejected promise when the model is not valid', (done) => {
            model.validate.returns(Promise.resolve({ status: false }));

            model.save()
                .catch((message) => {
                    expect(message).to.deep.equal({ status: false });
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
            // model.getCollectionChildren = sinon.stub().returns([model.dataElements]);
        });

        it('should return the dirty children properties', () => {
            expect(model.getDirtyChildren()).to.deep.equal([model.dataElements]);
        });
    });
});
