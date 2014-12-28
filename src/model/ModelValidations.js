/* global isNumeric, isArray, isString, isObject, isInteger */
(function () {
    'use strict';

    d2.ModelValidation = ModelValidation;

    function ModelValidation() {
        this.validate = validate;
    }

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
            default:
                //TODO: Add logger for d2?
                //TODO: Perhaps this should throw?
                window.console.log('No type validator found for', type);
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
        return value && value.length && value.length >= minValue;
    }

    function isSmallerThanLength(value, maxValue) {
        return value && value.length && value.length <= maxValue;
    }

})(window.d2 = window.d2 || {});
