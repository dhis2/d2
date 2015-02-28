'use strict';
import {checkType} from '../lib/check';
import ModelBase from './ModelBase.js';

class Model {
    constructor(modelDefinition) {
        checkType(modelDefinition, 'object', 'modelDefinition');
        checkType(modelDefinition.modelValidations, 'object', 'modelValidations');
        checkType(modelDefinition.modelProperties, 'object', 'modelProperties');

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

Model.prototype = ModelBase;

export default Model;
