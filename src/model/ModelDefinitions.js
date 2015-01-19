'use strict';

module.exports = ModelDefinitions;

function ModelDefinitions() {
    this.add = add;
}

function add(name) {
    //jshint validthis:true
    if (this[name]) {
        throw new Error(['Model', name, 'already exists'].join(' '));
    }
    this[name] = {};
}
