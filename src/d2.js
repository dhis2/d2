/*jshint unused: false */
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

function isDefined(value) {
    try {
        checkDefined(value);
        return true;
    } catch (e) {}

    return false;
}

function curry(toCurry, parameter) {
    if (typeof toCurry === 'function') {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);

            return toCurry.apply(this, [parameter].concat(args));
        };
    }
}

window.d2 = {};
/*jshint unused: false */
