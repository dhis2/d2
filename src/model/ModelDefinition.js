/* global checkType, curry */
(function () {
    'use strict';

    d2.ModelDefinition = ModelDefinition;

    function ModelDefinition(modelName, metaData, properties) {
        checkType(modelName, 'string');

        addProperty.call(this, 'name', modelName);
        addProperty.call(this, 'isMetaData', metaData || false);
        addProperty.call(this, 'modelProperties', properties);

        this.addProperty = addProperty;
    }
    ModelDefinition.createFromSchema = createFromSchema;

    function addProperty(name, value) {
        /*jshint validthis: true */
        var propertyDescriptor = {
            enumerable: true,
            configurable: false,
            writable: false,
            value: value
        };
        Object.defineProperty(this, name, propertyDescriptor);
    }

    function createFromSchema(schema) {
        checkType(schema, Object, 'Schema');

        return new ModelDefinition(schema.name, schema.metadata, Object.freeze(createPropertiesObject(schema.properties)));
    }

    function createPropertiesObject(schemaProperties) {
        var propertiesObject = {};
        var createModelPropertyOn = curry(createModelProperty, propertiesObject);

        (schemaProperties || []).forEach(createModelPropertyOn);

        return propertiesObject;
    }

    function createModelProperty(propertiesObject, schemaProperty) {
        var propertyDetails = {
            persisted: schemaProperty.persisted || false,
            simple: schemaProperty.simple || true
        };

        if (schemaProperty.name) {
            propertiesObject[schemaProperty.name] = propertyDetails;
        }
    }
})(d2);
