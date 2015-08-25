'use strict';

import {checkType, isObject, checkDefined, isDefined} from 'd2/lib/check';
import {addLockedProperty, curry, copyOwnProperties} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelCollection from 'd2/model/ModelCollection';
import schemaTypes from 'd2/lib/SchemaTypes';
import Filters from 'd2/model/Filters';
import {DIRTY_PROPERTY_LIST} from 'd2/model/ModelBase';

/**
 * @class ModelDefinition
 *
 * @description
 * Definition of a Model. Basically this object contains the meta data related to the Model. Like `name`, `apiEndPoint`, `modelValidation`, etc.
 * It also has methods to create and load Models that are based on this definition. The Data element `ModelDefinition` would be used to create Data Element `Model`s
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

        this.filters = Filters.getFilters(this);
    }

    filter() {
        return this.clone().filters;
    }

    /**
     * @method create
     *
     * @param {Object} [data] Datavalues that should be loaded into the model.
     *
     * @returns {Model} Returns the newly created model instance.
     *
     * @description
     * Creates a fresh Model instance based on the `ModelDefinition`. If data is passed into the method that
     * data will be loaded into the matching properties of the model.
     *
     * ```js
     * dataElement.create({name: 'ANC', id: 'd2sf33s3ssf'});
     * ```
     */
    create(data) {
        let model = Model.create(this);

        if (data) {
            //Set the datavalues onto the model directly
            Object.keys(model).forEach((key) => {
                model.dataValues[key] = data[key];
            });
        }

        return model;
    }

    clone() {
        let ModelDefinitionPrototype = Object.getPrototypeOf(this);
        let clonedDefinition = Object.create(ModelDefinitionPrototype);
        let priorFilters = this.filters.filters;

        clonedDefinition = copyOwnProperties(clonedDefinition, this);
        clonedDefinition.filters = Filters.getFilters(clonedDefinition);
        clonedDefinition.filters.filters = priorFilters.map(filter => filter);

        return clonedDefinition;
    }

    /**
     * @method get
     *
     * @param {String} identifier
     * @param {Object} [queryParams={fields: ':all'}] Query parameters that should be passed to the GET query.
     * @returns {Promise} Resolves with a `Model` instance or an error message.
     *
     * @description
     * Get a `Model` instance from the api loaded with data that relates to `identifier`.
     * This will do an API call and return a Promise that resolves with a `Model` or rejects with the api error message.
     *
     * ```js
     * //Do a get request for the dataElement with given id (d2sf33s3ssf) and print it's name
     * //when that request is complete and the model is loaded.
     * dataElement.get('d2sf33s3ssf')
     *   .then(model => console.log(model.name));
     * ```
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

    /**
     * @method list
     *
     * @param {Object} [queryParams={fields: ':all'}] Query parameters that should be passed to the GET query.
     * @returns {ModelCollection} Collection of model objects of the `ModelDefinition` type.
     *
     * @description
     * Loads a list of models.
     *
     * ```js
     * // Loads a list of models and prints their name.
     * dataElement.list()
     *   .then(modelCollection => {
     *     modelCollection.forEach(model => console.log(model.name));
     *   });
     * ```
     */
    list(queryParams = {fields: ':all'}) {
        let definedFilters = this.filters.getFilters();
        if (!isDefined(queryParams.filter) && definedFilters.length) {
            queryParams.filter = definedFilters;
        }

        return this.api.get(this.apiEndpoint, queryParams)
            .then((data) => {
                return ModelCollection.create(
                    this,
                    data[this.plural].map((data) => this.create(data)),
                    data.pager
                );
            });
    }

    /**
     * @method save
     *
     * @param {Model} model The model that should be saved to the server.
     * @returns {Promise} A promise which resolves when the save was successful
     * or rejects when it failed. The promise will resolve with the data that is
     * returned from the server.
     *
     * @description
     * This method is used by the `Model` instances to save the model when calling `model.save()`.
     *
     * @note {warning} This should generally not be accessed directly.
     */
    //TODO: check the return status of the save to see if it was actually successful and not ignored
    save(model) {
        let isAnUpdate = model => !!model.id;
        if (isAnUpdate(model)) {
            return this.api.update(model.dataValues.href, this.getOwnedPropertyJSON(model));
        } else {
            //Its a new object
            return this.api.post(this.apiEndpoint, this.getOwnedPropertyJSON(model));
        }
    }

    getOwnedPropertyJSON(model) {
        let objectToSave = {};
        let ownedProperties = this.getOwnedPropertyNames();

        Object.keys(this.modelValidations).forEach((propertyName) => {
            if (ownedProperties.indexOf(propertyName) >= 0) {
                if (model.dataValues[propertyName] !== undefined && model.dataValues[propertyName] !== null) {
                    objectToSave[propertyName] = model.dataValues[propertyName];
                }
            }
        });

        return objectToSave;
    }

    /**
     * @method getOwnedPropertyNames
     *
     * @returns {String[]} Returns an array of property names.
     *
     * @description
     * This method returns a list of property names that that are defined
     * as "owner" properties on this schema. This means these properties are used
     * when saving the model to the server.
     *
     * ```js
     * dataElement.getOwnedPropertyNames()
     * ```
     */
    getOwnedPropertyNames() {
        return Object.keys(this.modelValidations)
            .filter(propertyName => this.modelValidations[propertyName].owner);
    }

    /**
     * @method createFromSchema
     * @static
     *
     * @returns {ModelDefinition} Frozen model definition object.
     *
     * @description
     * This method creates a new `ModelDefinition` based on a JSON structure called
     * a schema. A schema represents the structure of a domain model as it is
     * required by DHIS. Since these schemas can not be altered on the server from
     * the modelDefinition is frozen to prevent accidental changes to the definition.
     *
     * ```js
     * ModelDefinition.createFromSchema(schemaDefinition);
     * ```
     *
     * @note {info} An example of a schema definition can be found on
     * https://apps.dhis2.org/demo/api/schemas/dataElement
     */
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
                this[DIRTY_PROPERTY_LIST].add(propertyName);
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
        writable: schemaProperty.writable,
        constants: schemaProperty.constants
    };

    //Add a referenceType to be able to get a hold of the reference objects model.
    if (validationDetails.type === 'REFERENCE' || (validationDetails.type === 'COLLECTION' && schemaProperty.itemPropertyType === 'REFERENCE')) {
        validationDetails.referenceType = getReferenceTypeFrom(schemaProperty);
    }

    if (propertyName) {
        validationObject[propertyName] = validationDetails;
    }

    function getReferenceTypeFrom(schemaProperty) {
        if (schemaProperty.href) {
            return schemaProperty.href.split('/').pop();
        }
    }
}

export default ModelDefinition;
