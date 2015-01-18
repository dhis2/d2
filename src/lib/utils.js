/**
 * Created by mark on 18/01/15.
 */

var utils = module.exports;

utils.throwError = throwError;
utils.addLockedProperty = addLockedProperty;
utils.curry = curry;

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
