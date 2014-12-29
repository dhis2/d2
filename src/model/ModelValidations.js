/* global isNumeric, isArray, isString, isObject, isInteger, checkType */
(function () {
    'use strict';
    var logger;

    d2.ModelValidation = ModelValidation;

    function ModelValidation(providedLogger) {
        checkType(providedLogger, 'object', 'logger (Logger)');
        logger = providedLogger;

        this.validate = validate;
    }

    ModelValidation.getModelValidation = function () {
        if (this.modelValidation) {
            return this.modelValidation;
        }
        return (this.modelValidation = new ModelValidation(d2.logger.Logger.getLogger(window)));
    };

    function validate(value, validationSettings) {
        if (isObject(validationSettings)) {
            return typeValidation(value, validationSettings.type) &&
                minMaxValidation(value, validationSettings);
        }
        return false;
    }

    function typeValidation(value, type) {
        switch (type) {
            case 'INTEGER':
                return isInteger(value);
            case 'NUMBER':
                return isNumeric(value);
            case 'COLLECTION':
                return isArray(value); // || isModelCollection();
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
        return false;
    }

    function isLargerThanMin(value, minValue) {
        return isNumeric(minValue) ? value >= minValue : true;
    }

    function isSmallerThanMax(value, maxValue) {
        return isNumeric(maxValue) ? value <= maxValue : true;
    }

    function isLargerThanLength(value, minValue) {
        return Boolean(value && value.length && value.length >= minValue);
    }

    function isSmallerThanLength(value, maxValue) {
        return Boolean(value && value.length && value.length <= maxValue);
    }

})(window.d2 = window.d2 || {});
