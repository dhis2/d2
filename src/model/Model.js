'use strict';
import ModelBase from './ModelBase.js';

var check = require('d2/lib/check');

class Model {
    constructor(modelDefinition) {
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
}

Model.create = function (modelDefinition) {
    return new Model(modelDefinition);
};

Model.prototype = ModelBase; //jshint nonew:false

export default Model;
