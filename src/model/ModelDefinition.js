/* global checkType, curry, contains, addLockedProperty */
(function () {
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

    ModelDefinition.prototype = {};
    ModelDefinition.prototype.create = function () {
        return new d2.Model(this);
    };

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
        var createModelPropertyOn = curry(createModelProperty, propertiesObject);

        (schemaProperties || []).forEach(createModelPropertyOn);

        return propertiesObject;
    }

    function createModelProperty(propertiesObject, schemaProperty) {
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
            type: typeLookup(schemaProperty.klass),
            required: !schemaProperty.nullable,
            minLength: schemaProperty.minLength,
            maxLength: schemaProperty.maxLength,
            owner: schemaProperty.owner,
            unique: schemaProperty.unique
        };

        if (propertyName) {
            validationObject[propertyName] = validationDetails;
        }
    }

    var typeTranslationMap = {
        'java.lang.String': 'text',
        'java.util.Date': Date,
        boolean: 'boolean',
        'org.hisp.dhis.acl.Access': Object
    };
    function typeLookup(javaType) {
        if (contains.call(Object.keys(typeTranslationMap), javaType)) {
            return typeTranslationMap[javaType];
        }
        return undefined;
    }
})(window.d2 = window.d2 || {});
