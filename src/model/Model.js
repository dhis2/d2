'use strict';

var check = require('d2/lib/check');
var ModelBase = require('./ModelBase');

module.exports = Model;

function Model(modelDefinition) {
    check.checkType(modelDefinition, 'object', 'modelDefinition');
    check.checkType(modelDefinition.modelValidations, 'object', 'modelValidations');
    check.checkType(modelDefinition.modelProperties, 'object', 'modelProperties');

    //Values object used to store the actual model values
    Object.defineProperty(this, 'dataValues', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: {}
    });

    //Validations object to store the validation rules
    Object.defineProperty(this, 'validations', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze(modelDefinition.modelValidations || {})
    });

    Object.defineProperties(this, modelDefinition.modelProperties);
}
Model.create = function (modelDefinition) {
    return new Model(modelDefinition);
};

Model.prototype = new ModelBase(); //jshint nonew:false
