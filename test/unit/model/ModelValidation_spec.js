describe('ModelValidations', () => {
    'use strict';

    var ModelValidation = require('d2/model/ModelValidation');
    var Logger = require('d2/logger/Logger');

    var modelValidation;
    var validationSettings;

    beforeEach(() => {
        var logger;
        logger = stub(new Logger({}));

        modelValidation = new ModelValidation(logger);
    });

    it('should create a ModelValidation object', () => {
        expect(modelValidation).to.be.instanceof(ModelValidation);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelValidation()).to.throw('Cannot call a class as a function'); //jshint ignore:line
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
            expect(modelValidation.validate(validationSettings, 2)).to.deep.equal({status: true});
        });

        it('should throw an error when there are no validationSettings', () => {
            expect(() => modelValidation.validate(undefined, 2)).to.throw('validationSettings should be of type object');
        });

        describe('min/max', () => {
            it('should not validate when smaller than min value', () => {
                expect(modelValidation.validate(validationSettings, -1)).to.deep.equal({status: false});
            });

            it('should not validate when larger than max value', () => {
                expect(modelValidation.validate(validationSettings, 2400)).to.deep.equal({status: false});
            });

            it('should validate when the value is exactly the min value', () => {
                expect(modelValidation.validate(validationSettings, 0)).to.deep.equal({status: true});
            });

            it('should validate when the value is exactly the max value', () => {
                expect(modelValidation.validate(validationSettings, 2342)).to.deep.equal({status: true});
            });

            it('should validate when the value is min value in decimal', () => {
                expect(modelValidation.validate(validationSettings, 0.0)).to.deep.equal({status: true});
            });
        });

        describe('type check', () => {
            it('should not validate an object', () => {
                expect(modelValidation.validate(validationSettings, {})).to.deep.equal({status: false});
            });

            it('should not validate when the type does not exist', () => {
                validationSettings.type = 'Fake type';
                expect(modelValidation.validate(validationSettings, {})).to.deep.equal({status: false});
            });

            it('should not validate an array', () => {
                expect(modelValidation.validate(validationSettings, [])).to.deep.equal({status: false});
            });

            it('should not validate undefined', () => {
                expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({status: false});
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
            expect(modelValidation.validate(validationSettings, 4)).to.deep.equal({status: true});
        });

        it('should not validate a decimal number', () => {
            expect(modelValidation.validate(validationSettings, 2.1)).to.deep.equal({status: false});
        });
    });

    //TODO: Implement validations for collections
    //describe('collectionValidation', () => {});

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
            expect(modelValidation.validate(validationSettings, [1, 2])).to.deep.equal({status: true});
        });

        it('should not validate the when the collection does not contain the mininum item count', () => {
            expect(modelValidation.validate(validationSettings, [])).to.deep.equal({status: false});
        });

        it('should not validate when the collection size is too large', () => {
            expect(modelValidation.validate(validationSettings, [1, 2, 3, 4])).to.deep.equal({status: false});
        });

        it('should validate a collection when the collection can be empty', () => {
            validationSettings.min = 0;

            expect(modelValidation.validate(validationSettings, [])).to.deep.equal({status: true});
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
            expect(modelValidation.validate(validationSettings, 'SomeString')).to.deep.equal({status: true});
        });

        it('should not validate a string that is too long', () => {
            expect(modelValidation.validate(validationSettings, 'SomeString is too long')).to.deep.equal({status: false});
        });

        it('should not validate a string that is too short', () => {
            expect(modelValidation.validate(validationSettings, 'ab')).to.deep.equal({status: false});
        });

        it('should validate a string that is exactly the min length', () => {
            expect(modelValidation.validate(validationSettings, 'abc')).to.deep.equal({status: true});
        });

        it('should validate a string in between min max', () => {
            expect(modelValidation.validate(validationSettings, 'abcdef')).to.deep.equal({status: true});
        });

        it('should not validate an empty value', () => {
            expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({status: false});
        });

        it('should validate an empty value when required is set to false', () => {
            validationSettings.required = false;

            expect(modelValidation.validate(validationSettings, undefined)).to.deep.equal({status: true});
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
            expect(modelValidation.validate(validationSettings, {})).to.deep.equal({status: true});
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
            expect(modelValidation.validate(validationSettings, '+31628456109')).to.deep.equal({status: true});
        });

        it('should validate a phone number with spaces', () => {
            expect(modelValidation.validate(validationSettings, '+31 6 284 56 109')).to.deep.equal({status: true});
        });

        it('should not validate a phone number with tabs', () => {
            expect(modelValidation.validate(validationSettings, '+31\t6284\t56 109')).to.deep.equal({status: false});
        });

        it('should not validate a phone number with new lines', () => {
            expect(modelValidation.validate(validationSettings, '+31\n6284\r\n56 109')).to.deep.equal({status: false});
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
        it('should be a function', () => {
            expect(modelValidation.validateAgainstSchema).to.be.instanceof(Function);
        });

        it('should return a promise', () => {
            expect(modelValidation.validateAgainstSchema()).to.be.instanceof(Promise);
        });
    });
});
