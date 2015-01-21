'use strict';

var check = require('d2/lib/check');

module.exports = ModelDefinitions;

function ModelDefinitions() {}
ModelDefinitions.prototype = {
    add: add,
    map: map
};

function add(modelDefinition) {
    try {
        check.checkType(modelDefinition.name, 'string');
    } catch (e) {
        throw new Error('Name should be set on the passed ModelDefinition to add one');
    }

    //jshint validthis:true
    if (this[modelDefinition.name]) {
        throw new Error(['Model', modelDefinition.name, 'already exists'].join(' '));
    }
    this[modelDefinition.name] = modelDefinition;
}

function map(transformer) {
    //jshint validthis:true
    var modelDefinition;
    var result = [];

    for (modelDefinition in this) {
        if (this.hasOwnProperty(modelDefinition)) {
            result.push(transformer(this[modelDefinition]));
        }
    }

    return result;
}
