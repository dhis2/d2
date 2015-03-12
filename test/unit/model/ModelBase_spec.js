function setupFakeModelValidation() {
    let validateSpy = sinon.stub();
    let proxyquire = require('proxyquire').noCallThru();

    class ModelValidation {
        constructor() {
            this.validate = validateSpy;
        }
    }
    ModelValidation.getModelValidation = function () {
        return new ModelValidation();
    };

    proxyquire('d2/model/ModelBase', {
        'd2/model/ModelValidation': ModelValidation
    });

    return validateSpy;
}

describe('ModelBase', () => {
    'use strict';

    //TODO: For some reason we have to setup the mock before the beforeEach and reset the spy, should figure out a way to perhaps do this differently.
    let validateSpy = setupFakeModelValidation();
    let modelBase;

    beforeEach(() => {
        validateSpy.reset();

        modelBase = require('d2/model/ModelBase');
    });

    it('should have a save method', () => {
        expect(modelBase.save).to.be.instanceof(Function);
    });

    it('should have a validate method', () => {
        expect(modelBase.validate).to.be.instanceof(Function);
    });

    describe('save', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                save: stub().returns(new Promise(function (resolve) {resolve();}))
            };

            class Model{
                constructor(modelDefinition) {
                    this.modelDefinition = modelDefinition;
                    this.validate = stub().returns({status: true});
                    this.dirty = true;
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
        });

        it('should call the save on the model modelDefinition with itself as a property', () => {
            model.save();

            expect(modelDefinition.save).to.have.been.calledWith(model);
        });

        it('should call validate before calling save', () => {
            model.save();

            expect(model.validate).to.have.been.calledBefore(model.save);
        });

        it('should not call save when validate fails', () => {
            model.validate.returns({status: false});

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
                });
        });

        it('should return rejected promise when the model is not dirty', function (done) {
            model.dirty = false;

            model.save()
                .catch(function (message) {
                    expect(message).to.equal('No changes to be saved');
                    done();
                });

        });

        it('should return rejected promise when the model is not valid', function (done) {
            model.validate.returns({status: false});

            model.save()
                .catch(function (message) {
                    expect(message).to.equal('Model status is not valid');
                    done();
                });
        });

        it('should return a promise', () => {
            expect(model.save()).to.be.instanceof(Promise);
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
                    unique: false
                }
            };

            class Model{
                constructor(modelValidations) {
                    this.validations = modelValidations;
                    this.dataValues = {
                        age: 4
                    };
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelValidations);

            validateSpy.returns(true);
            validateSpy.onFirstCall().returns(true);
            validateSpy.onSecondCall().returns(true);
        });

        it('should call validate on the model validator for each of the validations', () => {
            modelValidations.name = {};
            modelValidations.firstName = {};
            modelValidations.lastName = {};

            model.validate();

            expect(validateSpy).to.have.callCount(4);
        });

        it('should call validate on the ModelValidation with the correct data', () => {
            model.validate();

            expect(validateSpy).to.have.been.calledWith(4, modelValidations.age);
        });

        it('should return true when the value is correct', () => {
            expect(model.validate().status).to.be.true;
        });

        it('should return false when the validation fails', () => {
            validateSpy.onFirstCall().returns(false);

            expect(model.validate().status).to.be.false;
        });

        it('should return false when one of the validations returns false', () => {
            modelValidations.name = {};
            validateSpy.onSecondCall().returns(false);

            expect(model.validate().status).to.be.false;
        });

        it('should return true when all validations return true', () => {
            modelValidations.name = {};

            expect(model.validate().status).to.be.true;
        });

        it('should return a list of invalid fields', () => {
            validateSpy.onFirstCall().returns(false);

            model.dataValues.age = -1;

            expect(model.validate().fields).to.deep.equal(['age']);
        });
    });
});
