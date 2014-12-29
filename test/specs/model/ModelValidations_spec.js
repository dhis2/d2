describe('ModelValidations', function () {
    'use strict';

    var ModelValidation = d2.ModelValidation;
    var modelValidation;
    var validationSettings;

    beforeEach(function () {
        modelValidation = new ModelValidation();
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

    describe('stringValidation', function () {
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
});
