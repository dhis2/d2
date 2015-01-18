/* global checkType, checkDefined, curry, addLockedProperty, throwError, isString */
(function (d2) {
    'use strict';

    d2.ModelDefinition = ModelDefinition;

    function ModelDefinition(modelName, modelOptions, properties, validations) {
        checkType(modelName, 'string');

        addLockedProperty.call(this, 'name', modelName);
        addLockedProperty.call(this, 'isMetaData', (modelOptions && modelOptions.metadata) || false);
        addLockedProperty.call(this, 'apiEndpoint', modelOptions && modelOptions.apiEndpoint);
        addLockedProperty.call(this, 'modelProperties', properties);
        addLockedProperty.call(this, 'modelValidations', validations);
    }
    ModelDefinition.createFromSchema = createFromSchema;

    ModelDefinition.prototype = {
        create: create,
        get: get
    };

    function create() {
        //jshint validthis: true
        return new d2.Model(this);
        //jshint validthis: false
    }

    function get(identifier) {
        checkDefined(identifier, 'Identifier');

        return new Promise(function (resolve) {
            resolve(identifier);
        });
    }

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

    var primaryTypes = d2.getSchemaTypes() || [];
    function typeLookup(propertyType) {
        if (primaryTypes.indexOf(propertyType) >= 0 && isString(propertyType)) {
            return propertyType;
        }
        throwError(['Type from schema "', propertyType, '" not found available type list.'].join(''));
    }

})(window.d2 = window.d2 || {});
