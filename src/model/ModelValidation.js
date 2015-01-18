'use strict';

var check = require('../lib/check');
var Logger = require('../logger/Logger');

module.exports = ModelValidation;

var logger;
var typeSpecificValidations = {
    PHONENUMBER: [phoneNumber]
};

function ModelValidation(providedLogger) {
    check.checkType(providedLogger, 'object', 'logger (Logger)');
    logger = providedLogger;

    this.validate = validate;
}

ModelValidation.getModelValidation = function () {
    if (this.modelValidation) {
        return this.modelValidation;
    }
    return (this.modelValidation = new ModelValidation(Logger.getLogger(console)));
};

function validate(value, validationSettings) {
    if (check.isObject(validationSettings)) {
        if (validationSettings.required === false && !value) {
            return true;
        }

        return typeValidation(value, validationSettings.type) &&
            minMaxValidation(value, validationSettings) &&
            typeSpecificValidation(value, validationSettings.type);
    }
    return false;
}

//TODO: See if we can reduce the complexity of this function
function typeValidation(value, type) { //jshint maxcomplexity: 11
    switch (type) {
        case 'INTEGER':
            return check.isInteger(value);
        case 'NUMBER':
            return check.isNumeric(value);
        case 'COLLECTION':
            return check.isArray(value); // || isModelCollection();
        case 'PHONENUMBER':
        case 'EMAIL':
        case 'URL':
        case 'COLOR':
        case 'PASSWORD':
        case 'IDENTIFIER':
        case 'TEXT':
            return check.isString(value);
        default:
            //TODO: Add logger for d2?
            //TODO: Perhaps this should throw?
            logger.log('No type validator found for', type);
    }
    return false;
}

function minMaxValidation(value, validationSettings) {
    if (check.isNumeric(value)) {
        return isLargerThanMin(value, validationSettings.min) &&
            isSmallerThanMax(value, validationSettings.max);
    }
    if (check.isArray(value) || check.isString(value)) {
        return isLargerThanLength(value, validationSettings.min) &&
            isSmallerThanLength(value, validationSettings.max);
    }
    return false;
}

function isLargerThanMin(value, minValue) {
    return check.isNumeric(minValue) ? value >= minValue : true;
}

function isSmallerThanMax(value, maxValue) {
    return check.isNumeric(maxValue) ? value <= maxValue : true;
}

function isLargerThanLength(value, minValue) {
    return Boolean(value && value.length && value.length >= minValue);
}

function isSmallerThanLength(value, maxValue) {
    return Boolean(value && value.length && value.length <= maxValue);
}

function typeSpecificValidation(value, valueType) {
    if (!valueType || !check.isArray(typeSpecificValidations[valueType])) {
        return true;
    }

    return typeSpecificValidations[valueType]
        .reduce(function (currentValidationStatus, validationFunction) {
            return currentValidationStatus && validationFunction.apply(null, [value]);
        }, true);
}

var phoneNumberRegEx = /^[0-9\+ ]+$/;
function phoneNumber(value) {
    return phoneNumberRegEx.test(value);
}
