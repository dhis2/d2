import { checkType, isInteger, isObject, isArray, isString, isNumeric } from '../lib/check';
import Logger from '../logger/Logger';
import Api from '../api/Api';

let logger;

const phoneNumberRegEx = /^[0-9\+ ]+$/;
function phoneNumber(value) {
    return phoneNumberRegEx.test(value);
}
const typeSpecificValidations = {
    PHONENUMBER: [{
        message: 'Phone number can only consist of numbers and + and [space]',
        validator: phoneNumber,
    }],
};

function isLargerThanMin(value, minValue) {
    return isNumeric(minValue) ? value >= minValue : true;
}

function isSmallerThanMax(value, maxValue) {
    return isNumeric(maxValue) ? value <= maxValue : true;
}

function isLargerThanLength(value, minValue) {
    if (!isInteger(minValue)) {
        return true;
    }
    return Boolean(value && isInteger(value.length) && value.length >= minValue);
}

function isSmallerThanLength(value, maxValue) {
    if (!isInteger(maxValue)) {
        return true;
    }
    return Boolean(value && isInteger(value.length) && value.length <= maxValue);
}

function lengthMinMaxValidation(value, validationSettings) {
    const resultStatus = { status: true, messages: [] };

    if (isArray(value) || isString(value)) {
        if (!isLargerThanLength(value, validationSettings.min)) {
            resultStatus.status = false;
            resultStatus.messages.push({
                message: ['Value needs to be longer than or equal to', validationSettings.min].join(' '),
                value,
            });
        }

        if (!isSmallerThanLength(value, validationSettings.max)) {
            resultStatus.status = false;
            resultStatus.messages.push({
                message: ['Value needs to be shorter than or equal to', validationSettings.max].join(' '),
                value,
            });
        }
    }

    return resultStatus;
}

// TODO: Remove client side validation on models
function typeSpecificValidation(result, value, valueType) {
    if (!valueType || !isArray(typeSpecificValidations[valueType])) {
        return result;
    }

    result.status = typeSpecificValidations[valueType] // eslint-disable-line no-param-reassign
        .reduce((currentValidationStatus, customValidator) => {
            if (!customValidator.validator.apply(null, [value])) {
                result.messages.push({
                    message: customValidator.message,
                    value,
                });
                return false;
            }
            return currentValidationStatus;
        }, true);

    return result;
}

// TODO: See if we can reduce the complexity of this function
/* eslint-disable */
function typeValidation(value, type) {
    switch (type) {
    case 'INTEGER':
        return isInteger(value);
    case 'NUMBER':
        return isNumeric(value);
    case 'COLLECTION':
        return isArray(value) || isArray(Array.from(value.values()));
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
        // TODO: Add logger for d2?
        // TODO: Perhaps this should throw?
        logger.log('No type validator found for', type);
    }
    return false;
}
/* eslint-enable */

// TODO: Remove client side validation on models
function numberMinMaxValidation(value, validationSettings) {
    const resultStatus = { status: true, messages: [] };

    if (isNumeric(value)) {
        if (!isLargerThanMin(value, validationSettings.min)) {
            resultStatus.status = false;
            resultStatus.messages.push({
                message: ['Value needs to be larger than or equal to', validationSettings.min].join(' '),
                value,
            });
        }

        if (!isSmallerThanMax(value, validationSettings.max)) {
            resultStatus.status = false;
            resultStatus.messages.push({
                message: ['Value needs to be smaller than or equal to', validationSettings.max].join(' '),
                value,
            });
        }
    }

    return resultStatus;
}

// TODO: Remove client side validation on models
function minMaxValidation(result, value, validationSettings) {
    const numberMinMaxValidationStatus = numberMinMaxValidation(value, validationSettings);
    if (!numberMinMaxValidationStatus.status) {
        result.status = false;  // eslint-disable-line no-param-reassign
        result.messages = result.messages.concat(numberMinMaxValidationStatus.messages);  // eslint-disable-line no-param-reassign
    }

    const lengthMinMaxValidationStatus = lengthMinMaxValidation(value, validationSettings);
    if (!lengthMinMaxValidationStatus.status) {
        result.status = false;  // eslint-disable-line no-param-reassign
        result.messages = result.messages.concat(lengthMinMaxValidationStatus.messages);  // eslint-disable-line no-param-reassign
    }

    return result;
}

/**
 * @class ModelValidation
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
    // TODO: By default we validate min/max as correct for anything other than array, string and number
    validate(validationSettings, value) {
        if (!isObject(validationSettings)) {
            throw new TypeError('validationSettings should be of type object');
        }
        const result = { status: true, messages: [] };

        // No value when not required is a valid value.
        if (validationSettings.required === false && !value) {
            return { status: true, messages: [] };
        }

        if (!typeValidation(value, validationSettings.type)) {
            result.status = false;
            result.messages.push({
                message: 'This is not a valid type',
                value,
            });
        }

        minMaxValidation(result, value, validationSettings);
        typeSpecificValidation(result, value, validationSettings.type);

        return result;
    }

    /**
     * @method validateAgainstSchema
     *
     * @param {Model} model The model that should be validated.
     * @returns {Array} Returns an array with validation messages if there are any.
     *
     * @description
     * Sends a POST request against the `api/schemas` endpoint to check if the model is valid.
     *
     * @note {warn} Currently only checks
     */
    validateAgainstSchema(model) {
        if (!(model && model.modelDefinition && model.modelDefinition.name)) {
            return Promise.reject('model.modelDefinition.name can not be found');
        }

        function extractValidationViolations(webmessage) {
            if (webmessage.response && webmessage.response.validationViolations) {
                return webmessage.response.validationViolations;
            }
            throw new Error('Response was not a WebMessage with the expected format');
        }

        const url = `schemas/${model.modelDefinition.name}`;

        // TODO: The function getOwnedPropertyJSON should probably not be exposed, perhaps we could have a getJSONForModel(ownedPropertiesOnly=true) method.
        return Api.getApi().post(url, model.modelDefinition.getOwnedPropertyJSON(model))
            .then((webMessage) => {
                if (webMessage.status === 'OK') {
                    return [];
                }
                return Promise.reject(webMessage);
            })
            .catch(extractValidationViolations);
    }

    /**
     * @method getModelValidation
     * @static
     *
     * @returns {ModelValidation} New or memoized instance of `ModelInstance`
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

export default ModelValidation;
