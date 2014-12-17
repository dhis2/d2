/* global checkType, curry, contains, addLockedProperty */
(function () {
    'use strict';

    d2.ModelDefinition = ModelDefinition;

    function ModelDefinition(modelName, modelOptions, properties) {
        checkType(modelName, 'string');

        addLockedProperty.call(this, 'name', modelName);
        addLockedProperty.call(this, 'isMetaData', (modelOptions && modelOptions.metadata) || false);
        addLockedProperty.call(this, 'apiEndpoint', modelOptions && modelOptions.apiEndpoint);
        addLockedProperty.call(this, 'modelProperties', properties);
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
            Object.freeze(createPropertiesObject(schema.properties))
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
            },

            //Additional d2 Model data
            persisted: schemaProperty.persisted || false,
            type: typeLookup(schemaProperty.klass),
            required: !schemaProperty.nullable || false,
            owner: schemaProperty.owner
        };

        if (propertyName) {
            propertiesObject[propertyName] = propertyDetails;
        }
    }

    var typeTranslationMap = {
        'java.lang.String': 'string',
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
