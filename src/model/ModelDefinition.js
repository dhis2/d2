'use strict';

import {checkType, isObject, checkDefined} from 'd2/lib/check';
import {addLockedProperty, curry} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelCollection from 'd2/model/ModelCollection';
import schemaTypes from 'd2/lib/SchemaTypes';

/**
 * ModelDefinition
 *
 * Note: ModelDefinition has a property `api` that is used for the communication with the dhis2 api. The value of this
 * property is an instance of `Api`.
 */
class ModelDefinition {
    constructor(modelName, modelNamePlural, modelOptions, properties, validations) {
        checkType(modelName, 'string');
        checkType(modelNamePlural, 'string', 'Plural');

        addLockedProperty(this, 'name', modelName);
        addLockedProperty(this, 'plural', modelNamePlural);
        addLockedProperty(this, 'isMetaData', (modelOptions && modelOptions.metadata) || false);
        addLockedProperty(this, 'apiEndpoint', modelOptions && modelOptions.apiEndpoint);
        addLockedProperty(this, 'modelProperties', properties);
        addLockedProperty(this, 'modelValidations', validations);
    }

    /**
     * Create a fresh Model instance based on this `ModelDefinition`
     *
     * @returns {Model}
     */
    create(data) {
        let model = Object.seal(Model.create(this));

        if (data) {
            //Set the datavalues onto the model directly
            Object.keys(model).forEach((key) => {
                model.dataValues[key] = data[key];
            });
        }

        return model;
    }

    /**
     * Get a `Model` instance from the api loaded with data that relates to `identifier`.
     * This will do an API call and return a Promise that resolves with a `Model` or rejects with the api error message.
     *
     * @param {String} identifier
     * @returns {Promise} Resolves with a `Model` instance or an error message.
     */
    get(identifier, queryParams = {fields: ':all'}) {
        checkDefined(identifier, 'Identifier');

        //TODO: should throw error if API has not been defined
        return this.api.get([this.apiEndpoint, identifier].join('/'), queryParams)
            .then((data) => this.create(data))
            .catch((response) => {
                return Promise.reject(response.data);
            });
    }

    list(queryParams = {fields: ':all'}) {
        return this.api.get(this.apiEndpoint, queryParams)
            .then((data) => {
                return new ModelCollection(
                    this,
                    data[this.plural].map((data) => this.create(data)),
                    data.pager
                );
            });
    }

    save(model) {
        let objectToSave = {};

        Object.keys(this.modelValidations).forEach((propertyName) => {
            if (this.modelValidations[propertyName].owner) {
                if (model.dataValues[propertyName]) {
                    objectToSave[propertyName] = model.dataValues[propertyName];
                }
            }
        });

        return this.api.update(model.dataValues.href, objectToSave);
    }

    static createFromSchema(schema) {
        let ModelDefinitionClass;
        checkType(schema, Object, 'Schema');

        if (typeof ModelDefinition.specialClasses[schema.name] === 'function') {
            ModelDefinitionClass = ModelDefinition.specialClasses[schema.name];
        } else {
            ModelDefinitionClass = ModelDefinition;
        }

        return Object.freeze(new ModelDefinitionClass(
            schema.name,
            schema.plural,
            schema,
            Object.freeze(createPropertiesObject(schema.properties)),
            Object.freeze(createValidations(schema.properties))
        ));
    }
}

class UserModelDefinition extends ModelDefinition {
    get(identifier, queryParams = {fields: ':all,userCredentials[:owner]'}) {
        return super.get(identifier, queryParams);
    }
}

ModelDefinition.specialClasses = {
    user: UserModelDefinition
};

function createPropertiesObject(schemaProperties) {
    var propertiesObject = {};
    var createModelPropertyDescriptorOn = curry(createModelPropertyDescriptor, propertiesObject);

    (schemaProperties || []).forEach(createModelPropertyDescriptorOn);

    return propertiesObject;
}

function createModelPropertyDescriptor(propertiesObject, schemaProperty) {
    var propertyName = schemaProperty.collection ? schemaProperty.collectionName : schemaProperty.name;
    var propertyDetails = {
        //Actual property descriptor properties
        configurable: false,
        enumerable: true,
        get: function () {
            return this.dataValues[propertyName];
        }
    };

    //Only add a setter for writable properties
    if (schemaProperty.writable) {
        propertyDetails.set = function (value) {

            //TODO: Objects and Arrays are concidered unequal when their data is the same and therefore trigger a dirty
            if ((!isObject(value) && (value !== this.dataValues[propertyName])) || isObject(value)) {
                this.dirty = true;
                this.dataValues[propertyName] = value;
            }
        };
    }

    if (propertyName) {
        propertiesObject[propertyName] = propertyDetails;
    }
}

function createValidations(schemaProperties) {
    var validationsObject = {};
    var createModelPropertyOn = curry(createValidationSetting, validationsObject);

    (schemaProperties || []).forEach(createModelPropertyOn);

    return validationsObject;
}

function createValidationSetting(validationObject, schemaProperty) {
    var propertyName = schemaProperty.collection ? schemaProperty.collectionName : schemaProperty.name;
    var validationDetails = {
        persisted: schemaProperty.persisted,
        type: schemaTypes.typeLookup(schemaProperty.propertyType),
        required: schemaProperty.required,
        min: schemaProperty.min,
        max: schemaProperty.max,
        owner: schemaProperty.owner,
        unique: schemaProperty.unique,
        writable: schemaProperty.writable
    };

    if (propertyName) {
        validationObject[propertyName] = validationDetails;
    }
}

export default ModelDefinition;
