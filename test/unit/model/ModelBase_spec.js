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

describe('ModelBase', function () {
    'use strict';

    //TODO: For some reason we have to setup the mock before the beforeEach and reset the spy, should figure out a way to perhaps do this differently.
    let validateSpy = setupFakeModelValidation();
    let modelBase;

    beforeEach(() => {
        validateSpy.reset();

        modelBase = require('d2/model/ModelBase');
    });

    it('should have a create method', function () {
        expect(modelBase.create).to.be.instanceof(Function);
    });

    it('should have a save method', function () {
        expect(modelBase.save).to.be.instanceof(Function);
    });

    it('should have a validate method', function () {
        expect(modelBase.validate).to.be.instanceof(Function);
    });

    describe('save', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                save: spy()
            };

            class Model{
                constructor(modelDefinition) {
                    this.modelDefinition = modelDefinition;
                    this.validate = stub().returns({status: true});
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
        });

        it('should call the save on the model modelDefinition with itself as a property', () => {
            model.save();

            expect(modelDefinition.save).to.have.been.calledWith(model);
        });

        it('should call validate before calling save', function () {
            model.save();

            expect(model.validate).to.have.been.calledBefore(model.save);
        });

        it('should not call save when validate fails', function () {
            model.validate.returns({status: false});

            expect(modelDefinition.save).to.not.have.been.called;
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

        it('should call validate on the model validator for each of the validations', function () {
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

        it('should return true when the value is correct', function () {
            expect(model.validate().status).to.be.true;
        });

        it('should return false when the validation fails', function () {
            validateSpy.onFirstCall().returns(false);

            expect(model.validate().status).to.be.false;
        });

        it('should return false when one of the validations returns false', function () {
            modelValidations.name = {};
            validateSpy.onSecondCall().returns(false);

            expect(model.validate().status).to.be.false;
        });

        it('should return true when all validations return true', function () {
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
