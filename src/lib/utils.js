// TODO: Most of these functions should be moved out to d2-utilizr

export function throwError(message) {
    throw new Error(message);
}

// TODO: Throw an error when `toCurry` is not a function
export function curry(toCurry, parameter) {
    return function curried(...args) {
        return toCurry.apply(this, [parameter].concat(args));
    };
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
    return (item) => {
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

export function updateAPIUrlWithBaseUrlVersionNumber(apiUrl, baseUrl) {
    if (!baseUrl || !apiUrl) {
        return apiUrl;
    }

    const apiUrlWithVersionRexExp = /api\/(2[3-9])/;
    const apiVersionMatch = baseUrl.match(apiUrlWithVersionRexExp);

    const baseUrlHasVersion = apiVersionMatch && apiVersionMatch[1];
    const apiUrlHasVersion = apiUrl && !apiUrlWithVersionRexExp.test(apiUrl);

    if (baseUrlHasVersion && apiUrlHasVersion) {
        const version = apiVersionMatch[1];

        // Inject the current api version number into the endPoint urls
        return apiUrl.replace(/api/, `api/${version}`);
    }

    return apiUrl;
}
