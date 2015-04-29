/* global console */
'use strict';

import {checkType, isInteger, isObject, isArray, isString, isNumeric} from 'd2/lib/check';
import Logger from 'd2/logger/Logger';

let logger;
let typeSpecificValidations = {
    PHONENUMBER: [phoneNumber]
};

/**
 * @class ModelBase
 */
class ModelValidation {
    constructor(providedLogger) {
        checkType(providedLogger, 'object', 'logger (Logger)');
        logger = providedLogger;
    }

    /**
     * @method validate
     *
     * @param {Object} validationSettings
     * @param {*} value The value to be validated
     * @returns {{status: boolean, messages: Array}} Returns an object with the status. When the status is false the messages
     * array will contain messages on why the validation failed.
     *
     * @description
     * Validate a given value against the given validationSettings.
     * This checks if the value is of the defined `validationSettings.type`
     * if the value adheres to the set `validationSettings.min` and `validationSettings.max`
     * and runs any type specific validations like for example on the type PHONENUMBER if it is [0-9+ ] compliant.
     */
    validate(validationSettings, value) {
        if (!isObject(validationSettings)) {
            throw new TypeError('validationSettings should be of type object');
        }
        let status = false;

        //No value when not required is a valid value.
        if (validationSettings.required === false && !value) {
            return {status: true};
        }

        status = typeValidation(value, validationSettings.type) &&
            minMaxValidation(value, validationSettings) &&
            typeSpecificValidation(value, validationSettings.type);

        return {status: status};
    }

    validateAgainstSchema() {
        return Promise.resolve([]);
    }

    /**
     * @method getModelValidation
     * @static
     *
     * @returns {ModelValidation}
     *
     * @description
     * Returns the `ModelValidation` singleton. Creates a new one if it does not yet exist.
     * Grabs a logger instance by calling `Logger.getLogger`
     */
    static getModelValidation() {
        if (this.modelValidation) {
            return this.modelValidation;
        }
        return (this.modelValidation = new ModelValidation(Logger.getLogger(console)));
    }
}

//TODO: See if we can reduce the complexity of this function
function typeValidation(value, type) { //jshint maxcomplexity: 16
    switch (type) {
        case 'INTEGER':
            return isInteger(value);
        case 'NUMBER':
            return isNumeric(value);
        case 'COLLECTION':
            return isArray(value); // || isModelCollection();
        case 'PHONENUMBER':
        case 'EMAIL':
        case 'URL':
        case 'COLOR':
        case 'PASSWORD':
        case 'IDENTIFIER':
        case 'TEXT':
            return isString(value);
        case 'COMPLEX':
            return isObject(value);
        case 'DATE':
        case 'REFERENCE':
        case 'BOOLEAN':
        case 'CONSTANT':
            return true;
        default:
            //TODO: Add logger for d2?
            //TODO: Perhaps this should throw?
            logger.log('No type validator found for', type);
    }
    return false;
}

function minMaxValidation(value, validationSettings) {
    if (isNumeric(value)) {
        return isLargerThanMin(value, validationSettings.min) &&
            isSmallerThanMax(value, validationSettings.max);
    }
    if (isArray(value) || isString(value)) {
        return isLargerThanLength(value, validationSettings.min) &&
            isSmallerThanLength(value, validationSettings.max);
    }

    //TODO: By default we validate min/max as correct for anything other than array/string and number
    return true;
}

function isLargerThanMin(value, minValue) {
    return isNumeric(minValue) ? value >= minValue : true;
}

function isSmallerThanMax(value, maxValue) {
    return isNumeric(maxValue) ? value <= maxValue : true;
}

function isLargerThanLength(value, minValue) {
    return Boolean(value && isInteger(value.length) && value.length >= minValue);
}

function isSmallerThanLength(value, maxValue) {
    return Boolean(value && isInteger(value.length) && value.length <= maxValue);
}

function typeSpecificValidation(value, valueType) {
    if (!valueType || !isArray(typeSpecificValidations[valueType])) {
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

export default ModelValidation;
