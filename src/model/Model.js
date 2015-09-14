/**
 * @module Model
 *
 * @requires lib/check
 * @requires model/ModelBase
 */

import {checkType} from 'd2/lib/check';
import ModelBase from 'd2/model/ModelBase';
import {DIRTY_PROPERTY_LIST} from 'd2/model/ModelBase';

//TODO: Perhaps we can generate model classes dynamically based on the schemas and inherit from this.
/**
 * @class Model
 * @extends ModelBase
 *
 * @description
 * A Model represents an object from the DHIS2 Api. A model is created based of a ModelDefinition. The ModelDefinition
 * has the properties that the model should have.
 */
class Model {

    /**
     * @constructor
     *
     * @param {ModelDefinition} modelDefinition The model definition that corresponds with the model.
     * This is essential defining what type the model is representing.
     *
     * @description
     * Will create a new model instanced based on the model definition. When creating a new instance the model
     * definition needs to have both the modelValidations and modelProperties.
     *
     * The model properties will depend on the ModelDefinition. A model definition is based on a DHIS2 Schema.
     */
    constructor(modelDefinition) {
        checkType(modelDefinition, 'object', 'modelDefinition');
        checkType(modelDefinition.modelProperties, 'object', 'modelProperties');

        /**
         * @property {ModelDefinition} modelDefinition Stores reference to the modelDefinition that was used when
         * creating the model. This property is not enumerable or writable and will therefore not show up when looping
         * over the object properties.
         */
        Object.defineProperty(this, 'modelDefinition', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: modelDefinition
        });

        /**
         * @property {Boolean} dirty Represents the state of the model. When the model is concidered `dirty`
         * there are pending changes.
         * This property is not enumerable or writable and will therefore not show up when looping
         * over the object properties.
         */
        Object.defineProperty(this, 'dirty', {
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        });

        /**
         * @property {Object} dataValues Values object used to store the actual model values. Normally access to the
         * Model data will be done through accessor properties that are generated from the modelDefinition.
         *
         * @note {warning} This should not be accessed directly.
         */
        Object.defineProperty(this, 'dataValues', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: {}
        });

        const hasKeys = (object) => object && !!Object.keys(object).length;
        const attributes = {};
        const attributeProperties = modelDefinition.attributeProperties;
        if (hasKeys(attributeProperties)) {
            Object.defineProperty(this, 'attributes', {
                enumerable: false,
                value: attributes
            });

            Object
                .keys(attributeProperties)
                .forEach(attributeName => {
                    Object.defineProperty(attributes, attributeName, {
                        enumerable: true,
                        get: () => {
                            if (!Array.isArray(this.attributeValues)) {
                                return undefined;
                            }

                            return this.attributeValues
                                .filter(attributeValue => attributeValue.attribute.name === attributeName)
                                .reduce((current, attributeValue) => {
                                    return attributeValue.value;
                                }, undefined);
                        },
                        set: (value) => {
                            if (!this.attributeValues) { this.attributeValues = []; }

                            const attributeValue = this.attributeValues
                                .filter(attributeValue => attributeValue.attribute.name === attributeName)
                                .reduce((current, attributeValue) => {
                                    return attributeValue;
                                }, undefined);

                            if (attributeValue) {
                                // Don't do anything if the value stayed the same
                                if (attributeValue.value === value) {
                                    return;
                                }

                                attributeValue.value = value;
                            } else {

                                // Add the new attribute value to the attributeValues collection
                                this.attributeValues.push({
                                    value: value,
                                    attribute: {
                                        id: attributeProperties[attributeName].id,
                                        name: attributeProperties[attributeName].name
                                    }
                                });
                            }

                            // Set the model to be dirty
                            this.dirty = true;
                        }
                    });
                });
        }

        Object.defineProperties(this, modelDefinition.modelProperties);

        this[DIRTY_PROPERTY_LIST] = new Set([]);
    }

    /**
     * @method create
     * @static
     *
     * @param {ModelDefinition} modelDefinition ModelDefinition from which the model should be created
     * @returns {Model} Returns an instance of the model.
     *
     * @description The static method is a factory method to create Model objects. It calls `new Model()` with the passed `ModelDefinition`.
     *
     * ```js
     * let myModel = Model.create(modelDefinition);
     * ```
     */
    static create(modelDefinition) {
        return new Model(modelDefinition);
    }
}

Model.prototype = ModelBase;

export default Model;
