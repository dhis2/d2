'use strict';
import {checkType} from 'd2/lib/check';
import ModelBase from 'd2/model/ModelBase';

class Model {
    constructor(modelDefinition) {
        checkType(modelDefinition, 'object', 'modelDefinition');
        checkType(modelDefinition.modelValidations, 'object', 'modelValidations');
        checkType(modelDefinition.modelProperties, 'object', 'modelProperties');

        //Property to store reference to the modelDefinition
        Object.defineProperty(this, 'modelDefinition', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: modelDefinition
        });

        //Property to store dirty checking state
        Object.defineProperty(this, 'dirty', {
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        });

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
