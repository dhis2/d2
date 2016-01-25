export function throwError(message) {
    throw new Error(message);
}

export function curry(toCurry, parameter) {
    if (typeof toCurry === 'function') {
        return function curried() {
            const args = Array.prototype.slice.call(arguments, 0);

            return toCurry.apply(this, [parameter].concat(args));
        };
    }
}

export function addLockedProperty(object, name, value) {
    const propertyDescriptor = {
        enumerable: true,
        configurable: false,
        writable: false,
        value,
    };
    Object.defineProperty(object, name, propertyDescriptor);
}

export function copyOwnProperties(to, from) {
    let key;

    for (key in from) {
        if (from.hasOwnProperty(key)) {
            to[key] = from[key]; // eslint-disable-line no-param-reassign
        }
    }

    return to;
}

export function pick(property) {
    return item => {
        if (item) {
            return item[property];
        }
        return undefined;
    };
}

export class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    static create() {
        return new Deferred();
    }
}
