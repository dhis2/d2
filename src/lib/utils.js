'use strict';

export function throwError(message) {
    throw new Error(message);
}

export function curry(toCurry, parameter) {
    if (typeof toCurry === 'function') {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);

            return toCurry.apply(this, [parameter].concat(args));
        };
    }
}

export function addLockedProperty(object, name, value) {
    var propertyDescriptor = {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
    };
    Object.defineProperty(object, name, propertyDescriptor);
}

export function copyOwnProperties(to, from) {
    var key;

    for (key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key];
        }
    }

    return to;
}

export function pick(property) {
    return function (item) {
        if (item) {
            return item[property];
        }
        return undefined;
    };
}
