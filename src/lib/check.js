'use strict';

//TODO: Decide if checkType([], 'object') is a 'false' positive
export function checkType(value, type, name) {
    checkDefined(value, name);
    checkDefined(type, 'Type');

    if ((typeof type === 'function' && value instanceof type) ||
        (typeof type === 'string' && typeof value === type)) {
        return true;
    }
    throw new Error(['Expected', name || value,  'to have type', type].join(' '));
}

export function checkDefined(value, name) {
    if (value !== undefined) {
        return true;
    }
    throw new Error([name || 'Value', 'should be provided'].join(' '));
}

export function isType(value, type) {
    try {
        checkType(value, type);
        return true;
    } catch (e) {}

    return false;
}

export function isString(value) {
    return isType(value, 'string');
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isObject(value) {
    return isType(value, Object);
}

export function isDefined(value) {
    return value !== undefined;
}

/**
 * Polyfill for the isInteger function that will be added in ES6
 *
 * http://wiki.ecmascript.org/doku.php?id=harmony:number.isinteger
 */
if (!Number.isInteger) {
    Number.isInteger = isInteger;
}

export function isInteger(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        nVal > -9007199254740992 &&
        nVal < 9007199254740992 &&
        Math.floor(nVal) === nVal;
}

export function isNumeric(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        (nVal - parseFloat(nVal) + 1) >= 0;
}

export function contains(item, list) {
    list = (isArray(list) && list) || [];

    return list.indexOf(item) >= 0;
}

export function isValidUid(value) {
    return value && value.length === 11;
}

export default {
    checkType: checkType,
    checkDefined: checkDefined,
    isArray: isArray,
    isDefined: isDefined,
    isInteger: isInteger,
    isNumeric: isNumeric,
    isString: isString,
    isType: isType,
    contains: contains,
    isValidUid: isValidUid
};
