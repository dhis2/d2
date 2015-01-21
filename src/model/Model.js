'use strict';

var ModelBase = require('./ModelBase');

module.exports = Model;

function Model() {

}
Model.create = function (modelDefinition) {
    var model = new Model();

    //Values object used to store the actual model values
    Object.defineProperty(model, 'dataValues', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: {}
    });

    //Validations object to store the validation rules
    Object.defineProperty(model, 'validations', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze(modelDefinition.modelValidations || {})
    });

    Object.defineProperties(model, modelDefinition.modelProperties);

    return model;
};

Model.prototype = new ModelBase(); //jshint nonew:false
