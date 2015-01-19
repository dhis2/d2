describe('ModelValidations', function () {
    'use strict';

    var ModelValidation = require('d2/model/ModelValidation');
    var Logger = require('d2/logger/Logger');
    var sinon = require('sinon');

    var modelValidation;
    var validationSettings;

    beforeEach(function () {
        var logger;
        logger = sinon.stub(new Logger({}));

        modelValidation = new ModelValidation(logger);
    });

    it('should create a ModelValidation object', function () {
        expect(modelValidation).toEqual(jasmine.any(ModelValidation));
    });

    describe('validate', function () {
        beforeEach(function () {
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

        it('should validate', function () {
            expect(modelValidation.validate(2, validationSettings)).toBe(true);
        });

        it('should not validate when there are no validationSettings', function () {
            expect(modelValidation.validate(2)).toBe(false);
        });

        describe('min/max', function () {
            it('should not validate when smaller than min value', function () {
                expect(modelValidation.validate(-1, validationSettings)).toBe(false);
            });

            it('should not validate when larger than max value', function () {
                expect(modelValidation.validate(2400, validationSettings)).toBe(false);
            });

            it('should validate when the value is exactly the min value', function () {
                expect(modelValidation.validate(0, validationSettings)).toBe(true);
            });

            it('should validate when the value is exactly the max value', function () {
                expect(modelValidation.validate(2342, validationSettings)).toBe(true);
            });

            it('should validate when the value is min value in decimal', function () {
                expect(modelValidation.validate(0.0, validationSettings)).toBe(true);
            });
        });

        describe('type check', function () {
            it('should not validate an object', function () {
                expect(modelValidation.validate({}, validationSettings)).toBe(false);
            });

            it('should not validate when the type does not exist', function () {
                validationSettings.type = 'Fake type';
                expect(modelValidation.validate({}, validationSettings)).toBe(false);
            });

            it('should not validate an array', function () {
                expect(modelValidation.validate([], validationSettings)).toBe(false);
            });

            it('should not validate undefined', function () {
                expect(modelValidation.validate(undefined, validationSettings)).toBe(false);
            });
        });
    });

    describe('integerValidation', function () {
        beforeEach(function () {
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

        it('should validate a valid integer', function () {
            expect(modelValidation.validate(4, validationSettings)).toBe(true);
        });

        it('should not validate a decimal number', function () {
            expect(modelValidation.validate(2.1, validationSettings)).toBe(false);
        });
    });

    describe('collectionValidation', function () {
    });

    describe('arrayValidation', function () {
        beforeEach(function () {
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

        it('should validate a the array', function () {
            expect(modelValidation.validate([1, 2], validationSettings)).toBe(true);
        });

        it('should not validate the when the collection does not contain the mininum item count', function () {
            expect(modelValidation.validate([], validationSettings)).toBe(false);
        });

        it('should not validate when the collection size is too large', function () {
            expect(modelValidation.validate([1, 2, 3, 4], validationSettings)).toBe(false);
        });
    });

    describe('stringValidation', function () {
        beforeEach(function () {
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

        it('should validate the string "SomeString"', function () {
            expect(modelValidation.validate('SomeString', validationSettings)).toBe(true);
        });

        it('should not validate a string that is too long', function () {
            expect(modelValidation.validate('SomeString is too long', validationSettings)).toBe(false);
        });

        it('should not validate a string that is too short', function () {
            expect(modelValidation.validate('ab', validationSettings)).toBe(false);
        });

        it('should validate a string that is exactly the min length', function () {
            expect(modelValidation.validate('abc', validationSettings)).toBe(true);
        });

        it('should validate a string in between min max', function () {
            expect(modelValidation.validate('abcdef', validationSettings)).toBe(true);
        });

        it('should not validate an empty value', function () {
            expect(modelValidation.validate(undefined, validationSettings)).toBe(false);
        });

        it('should validate an empty value when required is set to false', function () {
            validationSettings.required = false;

            expect(modelValidation.validate(undefined, validationSettings)).toBe(true);
        });
    });

    describe('objectValidation', function () {
        beforeEach(function () {
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

        it('should validate the object', function () {
            expect(modelValidation.validate({}, validationSettings)).toBe(true);
        });
    });

    describe('ohone number validation', function () {
        beforeEach(function () {
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

        it('should validate a dutch phone number', function () {
            expect(modelValidation.validate('+31628456109', validationSettings)).toBe(true);
        });

        it('should validate a phone number with spaces', function () {
            expect(modelValidation.validate('+31 6 284 56 109', validationSettings)).toBe(true);
        });

        it('should not validate a phone number with tabs', function () {
            expect(modelValidation.validate('+31\t6284\t56 109', validationSettings)).toBe(false);
        });

        it('should not validate a phone number with new lines', function () {
            expect(modelValidation.validate('+31\n6284\r\n56 109', validationSettings)).toBe(false);
        });
    });

    describe('getModelValidation', function () {
        it('should return a ModelValidation object', function () {
            expect(ModelValidation.getModelValidation()).toEqual(jasmine.any(ModelValidation));
        });

        it('should create a singleton and return that', function () {
            expect(ModelValidation.getModelValidation()).toBe(ModelValidation.getModelValidation());
        });
    });
});
