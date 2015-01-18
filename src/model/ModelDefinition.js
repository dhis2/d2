'use strict';

var check = require('../lib/check');
var utils = require('../lib/utils');

var Model = require('./Model');

module.exports = ModelDefinition;

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

function ModelDefinition(modelName, modelOptions, properties, validations) {
    check.checkType(modelName, 'string');

    utils.addLockedProperty.call(this, 'name', modelName);
    utils.addLockedProperty.call(this, 'isMetaData', (modelOptions && modelOptions.metadata) || false);
    utils.addLockedProperty.call(this, 'apiEndpoint', modelOptions && modelOptions.apiEndpoint);
    utils.addLockedProperty.call(this, 'modelProperties', properties);
    utils.addLockedProperty.call(this, 'modelValidations', validations);
}
ModelDefinition.createFromSchema = createFromSchema;

ModelDefinition.prototype = {
    create: create,
    get: get
};

function create() {
    //jshint validthis: true
    return new Model(this);
    //jshint validthis: false
}

function get(identifier) {
    check.checkDefined(identifier, 'Identifier');

    return new Promise(function (resolve) {
        resolve(identifier);
    });
}

function createFromSchema(schema) {
    check.checkType(schema, Object, 'Schema');

    return Object.freeze(new ModelDefinition(
        schema.name,
        schema,
        Object.freeze(createPropertiesObject(schema.properties)),
        Object.freeze(createValidations(schema.properties))
    ));
}

function createPropertiesObject(schemaProperties) {
    var propertiesObject = {};
    var createModelPropertyDescriptorOn = utils.curry(createModelPropertyDescriptor, propertiesObject);

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
        },
        set: function (value) {
            this.dataValues[propertyName] = value;
        }
    };

    if (propertyName) {
        propertiesObject[propertyName] = propertyDetails;
    }
}

function createValidations(schemaProperties) {
    var validationsObject = {};
    var createModelPropertyOn = utils.curry(createValidationSetting, validationsObject);

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
        check.isString(propertyType)) {

        return propertyType;
    }
    utils.throwError(['Type from schema "', propertyType, '" not found available type list.'].join(''));
}
