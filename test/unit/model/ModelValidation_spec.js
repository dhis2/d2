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
    let validationSettings;

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

    describe('validate', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'NUMBER',
                required: true,
                min: 0,
                max: 2342,
                owner: true,
                unique: false
            };
        });

        it('should validate', () => {
            expect(modelValidation.validate(validationSettings, 2)).to.deep.equal({ status: true, messages: [] });
        });

        it('should throw an error when there are no validationSettings', () => {
            expect(() => modelValidation.validate(undefined, 2)).to.throw('validationSettings should be of type object');
        });

        describe('min/max', () => {
            it('should not validate when smaller than min value', () => {
                let expectedMessages = [{
                    message: 'Value needs to be larger than or equal to 0',
                    value: -1
                }];

                expect(modelValidation.validate(validationSettings, -1)).to.deep.equal({ status: false, messages: expectedMessages });
            });

            it('should not validate when larger than max value', () => {
                let expectedMessages = [{
                    message: 'Value needs to be smaller than or equal to 2342',
                    value: 2400
                }];

                expect(modelValidation.validate(validationSettings, 2400)).to.deep.equal({ status: false, messages: expectedMessages });
            });

            it('should validate when the value is exactly the min value', () => {
                expect(modelValidation.validate(validationSettings, 0)).to.deep.equal({ status: true, messages: [] });
            });

            it('should validate when the value is exactly the max value', () => {
                expect(modelValidation.validate(validationSettings, 2342)).to.deep.equal({ status: true, messages: [] });
            });

            it('should validate when the value is min value in decimal', () => {
                expect(modelValidation.validate(validationSettings, 0.0)).to.deep.equal({ status: true, messages: [] });
            });
        });

        describe('type check', () => {
            it('should not validate an object', () => {
                let expectedMessages = [{
                    message: 'This is not a valid type',
                    value: {}
                }];

                expect(modelValidation.validate(validationSettings, {})).to.deep.equal({ status: false, messages: expectedMessages });
            });

            it('should not validate when the type does not exist', () => {
                let expectedMessages = [{
                    message: 'This is not a valid type',
                    value: {}
                }];

                validationSettings.type = 'Fake type';
                expect(modelValidation.validate(validationSettings, {})).to.deep.equal({ status: false, messages: expectedMessages });
            });

            it('should not validate an array', () => {
                let expectedMessages = [{
                    message: 'This is not a valid type',
                    value: []
                }];

                expect(modelValidation.validate(validationSettings, [])).to.deep.equal({ status: false, messages: expectedMessages });
            });

            it('should not validate undefined', () => {
                let expectedMessages = [{
                    message: 'This is not a valid type',
                    value: undefined
                }];

                expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({ status: false, messages: expectedMessages });
            });
        });
    });

    describe('integerValidation', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'INTEGER',
                required: true,
                min: 0,
                max: 2342,
                owner: true,
                unique: false
            };
        });

        it('should validate a valid integer', () => {
            expect(modelValidation.validate(validationSettings, 4)).to.deep.equal({ status: true, messages: [] });
        });

        it('should not validate a decimal number', () => {
            let expectedMessages = [{
                message: 'This is not a valid type',
                value: 2.1
            }];

            expect(modelValidation.validate(validationSettings, 2.1)).to.deep.equal({ status: false, messages: expectedMessages });
        });
    });

    // TODO: Implement validations for collections
    // describe('collectionValidation', () => {});

    describe('arrayValidation', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'COLLECTION',
                required: true,
                min: 1,
                max: 3,
                owner: true,
                unique: false
            };
        });

        it('should validate a the array', () => {
            expect(modelValidation.validate(validationSettings, [1, 2])).to.deep.equal({ status: true, messages: [] });
        });

        it('should not validate the when the collection does not contain the mininum item count', () => {
            let expectedMessages = [{
                message: 'Value needs to be longer than or equal to 1',
                value: []
            }];
            expect(modelValidation.validate(validationSettings, [])).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should not validate when the collection size is too large', () => {
            let expectedMessages = [{
                message: 'Value needs to be shorter than or equal to 3',
                value: [1, 2, 3, 4]
            }];
            expect(modelValidation.validate(validationSettings, [1, 2, 3, 4])).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should validate a collection when the collection can be empty', () => {
            validationSettings.min = 0;

            expect(modelValidation.validate(validationSettings, [])).to.deep.equal({ status: true, messages: [] });
        });
    });

    describe('stringValidation', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'TEXT',
                required: true,
                min: 3,
                max: 10,
                owner: true,
                unique: false
            };
        });

        it('should validate the string "SomeString"', () => {
            expect(modelValidation.validate(validationSettings, 'SomeString')).to.deep.equal({ status: true, messages: [] });
        });

        it('should not validate a string that is too long', () => {
            let expectedMessages = [{
                message: 'Value needs to be shorter than or equal to 10',
                value: 'SomeString is too long'
            }];

            expect(modelValidation.validate(validationSettings, 'SomeString is too long')).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should not validate a string that is too short', () => {
            let expectedMessages = [{
                message: 'Value needs to be longer than or equal to 3',
                value: 'ab'
            }];

            expect(modelValidation.validate(validationSettings, 'ab')).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should validate a string that is exactly the min length', () => {
            expect(modelValidation.validate(validationSettings, 'abc')).to.deep.equal({ status: true, messages: [] });
        });

        it('should validate a string in between min max', () => {
            expect(modelValidation.validate(validationSettings, 'abcdef')).to.deep.equal({ status: true, messages: [] });
        });

        it('should not validate an empty value', () => {
            let expectedMessages = [{
                message: 'This is not a valid type',
                value: undefined
            }];

            expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should validate an empty value when required is set to false', () => {
            validationSettings.required = false;

            expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({ status: true, messages: [] });
        });
    });

    describe('objectValidation', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'COMPLEX',
                required: true,
                min: 1,
                max: 3,
                owner: true,
                unique: false
            };
        });

        it('should validate the object', () => {
            expect(modelValidation.validate(validationSettings, {})).to.deep.equal({ status: true, messages: [] });
        });
    });

    describe('phone number validation', () => {
        beforeEach(() => {
            validationSettings = {
                persisted: true,
                type: 'PHONENUMBER',
                required: true,
                min: 0,
                max: 50,
                owner: true,
                unique: false
            };
        });

        it('should validate a dutch phone number', () => {
            expect(modelValidation.validate(validationSettings, '+31628456109')).to.deep.equal({ status: true, messages: [] });
        });

        it('should validate a phone number with spaces', () => {
            expect(modelValidation.validate(validationSettings, '+31 6 284 56 109')).to.deep.equal({ status: true, messages: [] });
        });

        it('should not validate a phone number with tabs', () => {
            let expectedMessages = [{
                message: 'Phone number can only consist of numbers and + and [space]',
                value: '+31\t6284\t56 109'
            }];

            expect(modelValidation.validate(validationSettings, '+31\t6284\t56 109')).to.deep.equal({ status: false, messages: expectedMessages });
        });

        it('should not validate a phone number with new lines', () => {
            let expectedMessages = [{
                message: 'Phone number can only consist of numbers and + and [space]',
                value: '+31\n6284\r\n56 109'
            }];

            expect(modelValidation.validate(validationSettings, '+31\n6284\r\n56 109')).to.deep.equal({ status: false, messages: expectedMessages });
        });
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
                    'responseType': 'ValidationViolations'
                }
            }));
            modelMock = {
                modelDefinition: {
                    name: 'dataElement',
                    getOwnedPropertyJSON: sinon.stub()
                        .returns({ id: 'R4dd3wwdwdw', name: 'ANC' })
                }
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
                .then(function (validationMessages) {
                    expect(validationMessages).to.equal(schemaValidationResult.response.validationViolations);
                    done();
                })
                .catch(done);
        });

        it('should return an empty array when the validation passed', (done) => {
            modelValidation.validateAgainstSchema(modelMock)
                .then(function (validationMessages) {
                    expect(validationMessages).to.deep.equal([]);
                    done();
                })
                .catch(done);
        });
    });
});
