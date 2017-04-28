import { checkType, isObject, checkDefined, isDefined } from '../lib/check';
import { addLockedProperty, curry, copyOwnProperties, updateAPIUrlWithBaseUrlVersionNumber, pick } from '../lib/utils';
import ModelDefinitions from './ModelDefinitions';
import Model from './Model';
import ModelCollection from './ModelCollection';
import ModelCollectionProperty from './ModelCollectionProperty';
import schemaTypes from '../lib/SchemaTypes';
import Filters from './Filters';
import { DIRTY_PROPERTY_LIST } from './ModelBase';
import { getDefaultValuesForModelType } from './config';
import { getOwnedPropertyJSON } from './helpers/json';

function createModelPropertyDescriptor(propertiesObject, schemaProperty) {
    const propertyName = schemaProperty.collection ? schemaProperty.collectionName : schemaProperty.name;
    const propertyDetails = {
        // Actual property descriptor properties
        configurable: false,
        enumerable: true,
        get() {
            return this.dataValues[propertyName];
        },
    };

    // Store available constants for ENUM type properties
    if (schemaProperty.constants) {
        propertyDetails.constants = schemaProperty.constants;
    }

    // Only add a setter for writable properties
    if (schemaProperty.writable) {
        propertyDetails.set = function dynamicPropertySetter(value) {
            // TODO: Objects and Arrays are considered unequal when their data is the same and therefore trigger a dirty
            if ((!isObject(value) && (value !== this.dataValues[propertyName])) || isObject(value)) {
                this.dirty = true;
                this[DIRTY_PROPERTY_LIST].add(propertyName);
                this.dataValues[propertyName] = value;
            }
        };
    }

    if (propertyName) {
        propertiesObject[propertyName] = propertyDetails; // eslint-disable-line no-param-reassign
    }
}

function createPropertiesObject(schemaProperties) {
    const propertiesObject = {};
    const createModelPropertyDescriptorOn = curry(createModelPropertyDescriptor, propertiesObject);

    (schemaProperties || []).forEach(createModelPropertyDescriptorOn);

    return propertiesObject;
}

function createValidationSetting(validationObject, schemaProperty) {
    const propertyName = schemaProperty.collection ? schemaProperty.collectionName : schemaProperty.name;
    const validationDetails = {
        persisted: schemaProperty.persisted,
        type: schemaTypes.typeLookup(schemaProperty.propertyType),
        required: schemaProperty.required,
        min: schemaProperty.min,
        max: schemaProperty.max,
        owner: schemaProperty.owner,
        unique: schemaProperty.unique,
        writable: schemaProperty.writable,
        ordered: Boolean(schemaProperty.ordered),
        embeddedObject: Boolean(schemaProperty.embeddedObject),
    };

    function getReferenceTypeFrom(property) {
        if (property.href) {
            return property.href.split('/').pop();
        }

        return undefined;
    }

    // Add a referenceType to be able to get a hold of the reference objects model.
    if (
        validationDetails.type === 'REFERENCE' ||
        (validationDetails.type === 'COLLECTION' &&
        schemaProperty.itemPropertyType === 'REFERENCE')
    ) {
        validationDetails.referenceType = getReferenceTypeFrom(schemaProperty);
    }

    if (propertyName) {
        validationObject[propertyName] = validationDetails; // eslint-disable-line no-param-reassign
    }
}

function createValidations(schemaProperties) {
    const validationsObject = {};
    const createModelPropertyOn = curry(createValidationSetting, validationsObject);

    (schemaProperties || []).forEach(createModelPropertyOn);

    return validationsObject;
}


function shouldBeModelCollectionProperty(model, models) {
    return function shouldBeModelCollectionPropertyIterator(modelProperty) {
        return model &&
            models &&
            model.modelDefinition &&
            model.modelDefinition.modelValidations &&
            model.modelDefinition.modelValidations[modelProperty] &&
            model.modelDefinition.modelValidations[modelProperty].type === 'COLLECTION' &&
            models.hasOwnProperty(model.modelDefinition.modelValidations[modelProperty].referenceType);
    };
}

function isAnUpdate(modelToCheck) {
    return Boolean(modelToCheck.id);
}

const translatableProperties = new WeakMap();

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
    constructor(schema = {}, properties, validations, attributes, authorities) {
        checkType(schema.singular, 'string');
        checkType(schema.plural, 'string', 'Plural');

        addLockedProperty(this, 'name', schema.singular);
        addLockedProperty(this, 'displayName', schema.displayName);
        addLockedProperty(this, 'plural', schema.plural);
        addLockedProperty(this, 'isShareable', schema.shareable || false);
        addLockedProperty(this, 'isMetaData', schema.metadata || false);
        addLockedProperty(this, 'apiEndpoint', schema.apiEndpoint);
        addLockedProperty(this, 'javaClass', schema.klass);
        addLockedProperty(this, 'identifiableObject', schema && schema.identifiableObject);
        addLockedProperty(this, 'modelProperties', properties);
        addLockedProperty(this, 'modelValidations', validations);
        addLockedProperty(this, 'attributeProperties', attributes);
        addLockedProperty(this, 'authorities', authorities);
        addLockedProperty(this, 'translatable', schema.translatable || false);

        this.filters = Filters.getFilters(this);

        translatableProperties.set(this, (schema.properties || [])
            .filter(prop => prop.translationKey)
            .map(({ name, translationKey }) => ({ name, translationKey }))
        );

        // TODO: The function getOwnedPropertyJSON should probably not be exposed, perhaps we could have a getJSONForModel(ownedPropertiesOnly=true) method.
        this.getOwnedPropertyJSON = getOwnedPropertyJSON.bind(this);
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
        const model = Model.create(this);
        const validations = model.modelDefinition.modelValidations;
        const models = ModelDefinitions.getModelDefinitions();
        const dataValues = Object.assign({}, data);

        if (data) {
            // Set the data values onto the model directly
            Object
                .keys(model)
                .forEach((modelProperty) => {
                    const referenceType =
                        (validations[modelProperty].hasOwnProperty('referenceType') &&
                        validations[modelProperty].referenceType) ||
                        (models.hasOwnProperty(modelProperty) && modelProperty);

                    // For collections of objects, create ModelCollectionProperties rather than plain arrays
                    if (
                        referenceType &&
                        models.hasOwnProperty(referenceType) &&
                        Array.isArray(data[modelProperty])
                    ) {
                        // Object properties that are not themselves instances of models need special handling because
                        // we can't turn them into ModelCollectionProperties
                        // TODO: Proper generic handling of translations
                        if (modelProperty === 'translations' || modelProperty === 'greyedFields') {
                            dataValues[modelProperty] = data[modelProperty];
                        } else {
                            dataValues[modelProperty] = ModelCollectionProperty
                                .create(
                                    model,
                                    models[referenceType],
                                    data[modelProperty].map(d => models[referenceType].create(d))
                                );
                        }
                    }
                    model.dataValues[modelProperty] = dataValues[modelProperty];
                });
        } else {
            // Create empty ModelCollectionProperties for models without data.
            Object.keys(model)
                .filter(shouldBeModelCollectionProperty(model, models))
                .forEach((modelProperty) => {
                    const referenceType = model.modelDefinition.modelValidations[modelProperty].referenceType;

                    model.dataValues[modelProperty] = ModelCollectionProperty.create(model, models[referenceType], []);
                });

            // When no initial values are provided we are dealing with a new Model. For some properties there are
            // implicit default values that should be set. DHIS2 has some default values for models that would implicitly
            // be set when omitting sending a value on POST, we'll set these properties to their default values so they
            // are reflected in read operations on the model and to make them more transparent.
            const defaultValues = getDefaultValuesForModelType(model.modelDefinition.name);
            const checkForModelProperty = shouldBeModelCollectionProperty(model, models);

            Object
                .keys(model)
                .filter(modelProperty => !checkForModelProperty(modelProperty))
                .forEach((modelProperty) => {
                    model.dataValues[modelProperty] = defaultValues[modelProperty];
                });
        }

        return model;
    }

    clone() {
        const ModelDefinitionPrototype = Object.getPrototypeOf(this);
        const priorFilters = this.filters.filters;
        let clonedDefinition = Object.create(ModelDefinitionPrototype);

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
    get(identifier, queryParams = { fields: ':all,attributeValues[:all,attribute[id,name,displayName]]' }) {
        checkDefined(identifier, 'Identifier');

        if (Array.isArray(identifier)) {
            return this.list({ filter: [`id:in:[${identifier.join(',')}]`] });
        }

        // TODO: should throw error if API has not been defined
        return this.api.get([this.apiEndpoint, identifier].join('/'), queryParams)
            .then(data => this.create(data))
            .catch((response) => {
                if (response.message) {
                    return Promise.reject(response.message);
                }

                return Promise.reject(response);
            });
    }

    /**
     * @method list
     *
     * @param {Object} [extraParams={fields: ':all'}] Query parameters that should be passed to the GET query.
     * @returns {Promise} ModelCollection collection of models objects of the `ModelDefinition` type.
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
    list(listParams = {}) {
        const { apiEndpoint, ...extraParams } = listParams;
        const params = Object.assign({ fields: ':all' }, extraParams);
        const definedFilters = this.filters.getFilters();

        if (!isDefined(params.filter)) {
            delete params.filter;
            if (definedFilters.length) {
                params.filter = definedFilters;
            }
        }

        // If listParams.apiEndpoint exists, send the request there in stead of this.apiEndpoint
        return this.api.get(apiEndpoint || this.apiEndpoint, params)
            .then(responseData => ModelCollection.create(
                this,
                responseData[this.plural].map(data => this.create(data)),
                Object.assign(responseData.pager || {}, { query: params })
            ));
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
     * @note {warning} This should generally not be called directly.
     */
    // TODO: check the return status of the save to see if it was actually successful and not ignored
    save(model) {
        if (isAnUpdate(model)) {
            const jsonPayload = getOwnedPropertyJSON.bind(this)(model);
            const updateUrl = updateAPIUrlWithBaseUrlVersionNumber(model.dataValues.href, this.api.baseUrl);

            // Save the existing model
            return this.api.update(updateUrl, jsonPayload, true);
        }

        return this.saveNew(model);
    }

    saveNew(model) {
        const jsonPayload = getOwnedPropertyJSON.bind(this)(model);

        // Its a new object
        return this.api.post(this.apiEndpoint, jsonPayload);
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
     * @method delete
     *
     * @returns {Promise} Returns a promise to the deletion operation
     *
     * @description
     * This method is used by the `Model` instances to delete the model when calling `model.delete()`.
     *
     * @note {warning} This should generally not be called directly.
     */
    delete(model) {
        if (model.dataValues.href) {
            return this.api.delete(model.dataValues.href);
        }
        return this.api.delete([model.modelDefinition.apiEndpoint, model.dataValues.id].join('/'));
    }

    /**
     * @method isTranslatable
     *
     * @returns {Boolean} True when the schema can be translated, false otherwise
     */
    isTranslatable() {
        return this.translatable;
    }

    /**
     * @method getTranslatableProperties
     *
     * @returns {String[]} Returns a list of property names on the object that are translatable.
     *
     * @description
     * These properties can be translated using the DHIS2 _database_ translations.
     */
    getTranslatableProperties() {
        return translatableProperties
            .get(this)
            .map(pick('name'));
    }

    /**
     * @method getTranslatablePropertiesWithKeys
     *
     * @returns {Object[]} Returns an array with objects that have `name` and `translationKey` properties.
     *
     * @description
     * This method is similar to getTranslatableProperties() but in addition to the property names also returns the
     * `translationKey` that is used to save the translations for the property names.
     */
    getTranslatablePropertiesWithKeys() {
        return translatableProperties
            .get(this);
    }

    /**
     * @method createFromSchema
     * @static
     *
     * @param {Object} schema A schema definition received from the web api (/api/schemas)
     * @param {Object[]} attributes A list of attribute objects that describe custom attributes (/api/attributes)
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
     * ModelDefinition.createFromSchema(schemaDefinition, attributes);
     * ```
     *
     * @note {info} An example of a schema definition can be found on
     * https://apps.dhis2.org/demo/api/schemas/dataElement
     */
    static createFromSchema(schema, attributes = []) {
        let ModelDefinitionClass;
        checkType(schema, Object, 'Schema');

        if (typeof ModelDefinition.specialClasses[schema.singular] === 'function') {
            ModelDefinitionClass = ModelDefinition.specialClasses[schema.singular];
        } else {
            ModelDefinitionClass = ModelDefinition;
        }

        return Object.freeze(new ModelDefinitionClass(
            schema,
            Object.freeze(createPropertiesObject(schema.properties)),
            Object.freeze(createValidations(schema.properties)),
            attributes
                .reduce((current, attributeDefinition) => {
                    current[attributeDefinition.name] = attributeDefinition; // eslint-disable-line no-param-reassign
                    return current;
                }, {}),
            schema.authorities
        ));
    }
}

class UserModelDefinition extends ModelDefinition {
    // TODO: userCredentials should always be included, no matter what the query params, that is currently not the case
    get(identifier, queryParams = { fields: ':all,userCredentials[:owner]' }) {
        return super.get(identifier, queryParams);
    }
}

class DataSetModelDefinition extends ModelDefinition {
    create(data = {}) {
        const hasData = Boolean(Object.keys(data).length);

        // Filter out the compulsoryDataElementOperands structure from the retrieved data
        // This structure does not follow the convention of a typical reference. We can not create a proper
        // ModelCollection for this collection.
        const dataClone = Object
            .keys(data)
            .filter(key => key !== 'compulsoryDataElementOperands')
            .reduce((obj, key) => {
                obj[key] = data[key]; // eslint-disable-line no-param-reassign
                return obj;
            }, {});

        // Create the model using the usual way of creating a model
        // Only pass data when there is data in the object passed to the constructor. This will guarantee
        // that the empty ModelCollections are created properly.
        const model = super.create(hasData ? dataClone : undefined);

        // Set the compulsoryDataElementOperands onto the dataValues so it will be included during the save operations
        model.dataValues.compulsoryDataElementOperands = data.compulsoryDataElementOperands;

        return model;
    }
}

class OrganisationUnitModelDefinition extends ModelDefinition {
    // If a 'root' is specified when listing organisation units the results will be limited to the root and its
    // descendants. This is special behavior for the organisation unit API endpoint, which is documented here:
    // https://dhis2.github.io/dhis2-docs/master/en/developer/html/webapi_organisation_units.html
    list(extraParams = {}) {
        const { root, ...params } = extraParams;

        if (extraParams.hasOwnProperty('root') && root) {
            params.apiEndpoint = `${this.apiEndpoint}/${root}`;
        }

        return super.list(params);
    }
}

ModelDefinition.specialClasses = {
    user: UserModelDefinition,
    dataSet: DataSetModelDefinition,
    organisationUnit: OrganisationUnitModelDefinition,
};

export default ModelDefinition;
