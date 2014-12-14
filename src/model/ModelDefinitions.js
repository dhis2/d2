function ModelDefinitions() {
    this.add = add;
}

function add(name) {
    if (this[name]) {
        throw new Error(['Model', name, 'already exists'].join(' '));
    }
    this[name] = {};
}
