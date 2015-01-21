'use strict';

module.exports = {
    isType: isType,
    isObject: isObject,
    isArray: isArray,
    isString: isString,
    isDefined: isDefined,
    isInteger: isInteger,
    isNumeric: isNumeric,
    checkType: checkType,
    checkDefined: checkDefined,
    contains: contains
};

//TODO: Decide if checkType([], 'object') is a 'false' positive
function checkType(value, type, name) {
    checkDefined(value, name);
    checkDefined(type, 'Type');

    if ((typeof type === 'function' && value instanceof type) ||
        (typeof type === 'string' && typeof value === type)) {
        return true;
    }
    throw new Error(['Expected', name || value,  'to have type', type].join(' '));
}

function checkDefined(value, name) {
    if (value !== undefined) {
        return true;
    }
    throw new Error([name || 'Value', 'should be provided'].join(' '));
}

function isType(value, type) {
    try {
        checkType(value, type);
        return true;
    } catch (e) {}

    return false;
}

function isString(value) {
    return isType(value, 'string');
}

function isArray(value) {
    return Array.isArray(value);
}

function isObject(value) {
    return isType(value, Object);
}

function isDefined(value) {
    try {
        checkDefined(value);
        return true;
    } catch (e) {}

    return false;
}

/**
 * Polyfill for the isInteger function that will be added in ES6
 *
 * http://wiki.ecmascript.org/doku.php?id=harmony:number.isinteger
 */
if (!Number.isInteger) {
    Number.isInteger = isInteger;
}

function isInteger(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        nVal > -9007199254740992 &&
        nVal < 9007199254740992 &&
        Math.floor(nVal) === nVal;
}

function isNumeric(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        (nVal - parseFloat(nVal) + 1) >= 0;
}

function contains(item, list) {
    list = (isArray(list) && list) || [];

    return list.indexOf(item) >= 0;
}
