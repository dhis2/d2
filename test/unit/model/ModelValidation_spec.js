let proxyquire = require('proxyquire').noCallThru();
proxyquire('../../../src/api/Api', {
    '../../../src/external/jquery': {}
});

describe('ModelValidations', () => {
    'use strict';

    let ModelValidation = require('../../../src/model/ModelValidation');
    let Logger = require('../../../src/logger/Logger');
    let Api = require('../../../src/api/Api');

    let api;
    let modelValidation;

    beforeEach(() => {
        api = Api.getApi();
        let logger;
        logger = stub(new Logger({}));

        modelValidation = new ModelValidation(logger);
    });

    it('should create a ModelValidation object', () => {
        expect(modelValidation).to.be.instanceof(ModelValidation);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelValidation()).to.throw('Cannot call a class as a function');
    });

    describe('getModelValidation', () => {
        it('should return a ModelValidation object', () => {
            expect(ModelValidation.getModelValidation()).to.be.instanceof(ModelValidation);
        });

        it('should create a singleton and return that', () => {
            expect(ModelValidation.getModelValidation()).to.equal(ModelValidation.getModelValidation());
        });
    });

    describe('validateAgainstSchema', () => {
        let modelMock;

        beforeEach(() => {
            Api.getApi().post = sinon.stub().returns(Promise.resolve({
                'httpStatus': 'OK',
                'httpStatusCode': 200,
                'status': 'OK',
                'response': {
                    'responseType': 'ValidationViolations',
                },
            }));
            modelMock = {
                modelDefinition: {
                    name: 'dataElement',
                    getOwnedPropertyJSON: sinon.stub()
                        .returns({ id: 'R4dd3wwdwdw', name: 'ANC' }),
                },
            };
        });

        it('should be a function', () => {
            expect(modelValidation.validateAgainstSchema).to.be.instanceof(Function);
        });

        it('should return a promise', () => {
            expect(modelValidation.validateAgainstSchema(modelMock)).to.be.instanceof(Promise);
        });

        it('should return a rejected promise if the model.modelDefinition.name is not present', (done) => {
            modelValidation.validateAgainstSchema()
                .catch(message => {
                    expect(message).to.equal('model.modelDefinition.name can not be found');
                    done();
                });
        });

        it('should call the post method on the Api', (done) => {
            modelValidation.validateAgainstSchema(modelMock)
                .then(() => {
                    expect(api.post).to.be.called;
                    done();
                });
        });

        it('should call the post method on the api with the modeldata', (done) => {
            modelValidation.validateAgainstSchema(modelMock)
                .then(() => {
                    expect(api.post).to.be.calledWith(
                        'schemas/dataElement',
                        { id: 'R4dd3wwdwdw', name: 'ANC' }
                    );
                    done();
                });
        });

        it('should return the validationViolations array from the webmessage', (done) => {
            const schemaValidationResult = {
                httpStatus: 'Bad Request',
                httpStatusCode: 400,
                status: 'ERROR',
                response: {
                    responseType: 'ValidationViolations',
                    validationViolations: [{ message: 'Required property missing.', property: 'name' }],
                },
            };
            Api.getApi().post = sinon.stub().returns(Promise.reject(schemaValidationResult));

            modelValidation.validateAgainstSchema(modelMock)
                .then((validationMessages) => {
                    expect(validationMessages).to.equal(schemaValidationResult.response.validationViolations);
                    done();
                })
                .catch(done);
        });

        it('should return an empty array when the validation passed', (done) => {
            modelValidation.validateAgainstSchema(modelMock)
                .then((validationMessages) => {
                    expect(validationMessages).to.deep.equal([]);
                    done();
                })
                .catch(done);
        });

        it('should throw an error when the server does not return the correct WebMessage format', () => {
            const schemaValidationResult = {
                httpStatus: 'Bad Request',
                httpStatusCode: 400,
                status: 'ERROR',
                response: {},
            };
            Api.getApi().post = sinon.stub().returns(Promise.reject(schemaValidationResult));

            return modelValidation.validateAgainstSchema(modelMock)
                .catch((errorMessage) => {
                    expect(errorMessage.message).to.equal('Response was not a WebMessage with the expected format');
                });
        });

        it('should reject the promise if the server gives a successful statuscode but the webmessage status is not the `OK` string', () => {
            Api.getApi().post = sinon.stub().returns(Promise.resolve({data: 'someData'}));

            return modelValidation.validateAgainstSchema(modelMock)
                .catch((errorMessage) => {
                    expect(errorMessage.message).to.equal('Response was not a WebMessage with the expected format')
                });
        });
    });

    describe('client side validation', () => {
       it('is deprecated and should throw an error', () => {
           expect(modelValidation.validate).to.throw(Error);
       });
    });
});
