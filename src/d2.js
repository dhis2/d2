function checkType(value, type) {
    if (!(value && type)) {
        throw Error('Value and type should be provided');
    }

    if ((typeof type === 'object' && value instanceof type) ||
        (typeof type === 'string' && typeof value === type)) {
        return true;
    }

    throw Error(['Expected', value, 'to have type', type].join(' '));
}

window.d2 = Object.create(null);
