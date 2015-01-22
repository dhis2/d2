/**
 * Created by mark on 18/01/15.
 */

module.exports = {
    throwError: throwError,
    addLockedProperty: addLockedProperty,
    curry: curry,
    copyOwnProperties: copyOwnProperties,
    pick: pick
};

function throwError(message) {
    throw new Error(message);
}

function curry(toCurry, parameter) {
    if (typeof toCurry === 'function') {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);

            return toCurry.apply(this, [parameter].concat(args));
        };
    }
}

function addLockedProperty(name, value) {
    var propertyDescriptor = {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
    };
    Object.defineProperty(this, name, propertyDescriptor);
}

function copyOwnProperties(to, from) {
    var key;

    for (key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key];
        }
    }

    return to;
}

function pick(property) {
    return function (item) {
        if (item) {
            return item[property];
        }
        return undefined;
    };
}
