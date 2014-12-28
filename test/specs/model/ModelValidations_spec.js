describe('ModelValidations', function () {
    'use strict';

    var ModelValidation = d2.ModelValidation;
    var modelValidation;

    beforeEach(function () {
        modelValidation = new ModelValidation();
    });

    it('should create a ModelValidation object', function () {
        expect(modelValidation).toEqual(jasmine.any(ModelValidation));
    });

    describe('validate', function () {
        var validationSettings;

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
        var validationSettings;

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
    });
});
