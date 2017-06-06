/**
 * @private
 */
export function checkDefined(value, name) {
    if (value !== undefined) {
        return true;
    }
    throw new Error([name || 'Value', 'should be provided'].join(' '));
}

// TODO: Decide if checkType([], 'object') is a 'false' positive
/**
 * @private
 */
export function checkType(value, type, name) {
    checkDefined(value, name);
    checkDefined(type, 'Type');

    if ((typeof type === 'function' && value instanceof type) ||
        (typeof type === 'string' && typeof value === type)) { // eslint-disable-line valid-typeof
        return true;
    }
    throw new Error(['Expected', name || value, 'to have type', type].join(' '));
}

// TODO: Log type error?
/**
 * @private
 */
export function isType(value, type) {
    function noop() {}

    try {
        checkType(value, type);
        return true;
    } catch (e) {
        noop();
    }

    return false;
}

/**
 * @private
 */
export function isString(value) {
    return isType(value, 'string');
}

/**
 * @private
 */
export function isArray(value) {
    return Array.isArray(value);
}

/**
 * @private
 */
export function isObject(value) {
    return isType(value, Object);
}

/**
 * @private
 */
export function isDefined(value) {
    return value !== undefined;
}

/**
 * @private
 */
export function isInteger(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        nVal > -9007199254740992 &&
        nVal < 9007199254740992 &&
        Math.floor(nVal) === nVal;
}

// Polyfill for the isInteger function that will be added in ES6
// http://wiki.ecmascript.org/doku.php?id=harmony:number.isinteger
/* istanbul ignore if  */
if (!Number.isInteger) {
    Number.isInteger = isInteger;
}

/**
 * @private
 */
export function isNumeric(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        ((nVal - parseFloat(nVal)) + 1) >= 0;
}

/**
 * @private
 */
export function contains(item, list) {
    const listToCheck = (isArray(list) && list) || [];

    return listToCheck.indexOf(item) >= 0;
}

/**
 * @private
 */
export function isValidUid(value) {
    return value && value.length === 11;
}

/**
 * @private
 */
export default {
    checkType,
    checkDefined,
    isArray,
    isDefined,
    isInteger,
    isNumeric,
    isString,
    isType,
    contains,
    isValidUid,
};
