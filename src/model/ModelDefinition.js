'use strict';

import {checkType, isString, isObject, checkDefined} from 'd2/lib/check';
import {addLockedProperty, curry, throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';

//Schemas
var schemaTypes = [
    'TEXT',
    'NUMBER',
    'INTEGER',
    'BOOLEAN',
    'EMAIL',
    'PASSWORD',
    'URL',
    'PHONENUMBER',
    'GEOLOCATION', //TODO: Geo location could be an advanced type of 2 numbers / strings?
    'COLOR',
    'COMPLEX',
    'COLLECTION',
    'REFERENCE',
    'DATE',
    'COMPLEX',
    'IDENTIFIER'
];

function getSchemaTypes() {
    return schemaTypes;
}

/**
 * ModelDefinition
 *
 * Note: ModelDefinition has a property `api` that is used for the communication with the dhis2 api. The value of this
 * property is an instance of `Api`.
 */
class ModelDefinition {
    constructor(modelName, modelOptions, properties, validations) {
        checkType(modelName, 'string');

        addLockedProperty(this, 'name', modelName);
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
    create() {
        return Object.seal(Model.create(this));
    }

    /**
     * Get a `Model` instance from the api loaded with data that relates to `identifier`.
     * This will do an API call and return a Promise that resolves with a `Model` or rejects with the api error message.
     *
     * @param {String} identifier
     * @returns {Promise} Resolves with a `Model` instance or an error message.
     */
    get(identifier) {
        checkDefined(identifier, 'Identifier');

        //TODO: should throw error if API has not been defined
        return this.api.get([this.apiEndpoint, identifier].join('/'), {fields: ':all'})
            .then((data) => {
                var model = this.create();

                //Set the datavalues onto the model directly
                Object.keys(model).forEach((key) => {
                    model.dataValues[key] = data[key];
                });

                return model;
            })
            .catch((response) => {
                return Promise.reject(response.data);
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
}

ModelDefinition.createFromSchema = createFromSchema;
function createFromSchema(schema) {
    checkType(schema, Object, 'Schema');

    return Object.freeze(new ModelDefinition(
        schema.name,
        schema,
        Object.freeze(createPropertiesObject(schema.properties)),
        Object.freeze(createValidations(schema.properties))
    ));
}

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
        type: typeLookup(schemaProperty.propertyType),
        required: schemaProperty.required,
        min: schemaProperty.min,
        max: schemaProperty.max,
        owner: schemaProperty.owner,
        unique: schemaProperty.unique
    };

    if (propertyName) {
        validationObject[propertyName] = validationDetails;
    }
}

var primaryTypes = getSchemaTypes();
function typeLookup(propertyType) {
    if (primaryTypes.indexOf(propertyType) >= 0 &&
        isString(propertyType)) {

        return propertyType;
    }
    throwError(['Type from schema "', propertyType, '" not found available type list.'].join(''));
}

export default ModelDefinition;
