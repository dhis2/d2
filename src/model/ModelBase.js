import ModelValidation from './ModelValidation';
import { isValidUid } from '../lib/check';
import { getJSONForProperties } from './helpers/json';

const modelValidator = ModelValidation.getModelValidation();

/**
 * @private
 * @type {Symbol}
 */
export const DIRTY_PROPERTY_LIST = Symbol('List to keep track of dirty properties');

function hasModelValidationForProperty(model, property) {
    return Boolean(model.modelDefinition &&
        model.modelDefinition.modelValidations &&
        model.modelDefinition.modelValidations[property] &&
        Object.prototype.hasOwnProperty.call(model.modelDefinition.modelValidations, property));
}

function updateModelFromResponseStatus(result) {
    if (result && result.httpStatus === 'Created' && result && isValidUid(result.response.uid)) {
        this.dataValues.id = result.response.uid;
        this.dataValues.href = [this.modelDefinition.apiEndpoint, this.dataValues.id].join('/');
    }
    this.dirty = false;
    this.getDirtyChildren()
        .forEach((value) => {
            if (value.resetDirtyState) {
                value.resetDirtyState();
            } else {
                value.dirty = false; // eslint-disable-line no-param-reassign
            }
        });

    this[DIRTY_PROPERTY_LIST].clear();
    return result;
}

/**
 * @class ModelBase
 */
class ModelBase {
    /**
     * @method create
     *
     * @returns {Promise} Returns a promise that resolves when the model has been saved or rejected with the result from
     * the `validate()` call.
     *
     * @definition
     * Will save model as a new object to the server using a POST request. This method would generally be used if
     * you're creating models with pre-specified IDs. Note that this does not check if the model is marked as dirty.
     */
    create() {
        return this.validate()
            .then((validationState) => {
                if (!validationState.status) {
                    return Promise.reject(validationState);
                }

                return this.modelDefinition
                    .saveNew(this)
                    .then(apiResponse => updateModelFromResponseStatus.call(this, apiResponse));
            });
    }

    /**
     * @method save
     *
     * @returns {Promise} Returns a promise that resolves when the model has been saved
     * or rejects with the result from the `validate()` call.
     *
     * @description
     * Checks if the model is dirty. When the model is dirty it will check if the values of the model are valid by calling
     * `validate`. If this is correct it will attempt to save the [Model](#/model/Model) to the api.
     *
     * @example
     * myModel.save()
     *   .then((message) => console.log(message));
     */
    save(includeChildren) {
        // Calling save when there's nothing to be saved is a no-op
        if (!this.isDirty(includeChildren)) {
            return Promise.resolve({});
        }

        return this.validate()
            .then((validationState) => {
                if (!validationState.status) {
                    return Promise.reject(validationState);
                }

                return this.modelDefinition
                    .save(this)
                    .then(apiResponse => updateModelFromResponseStatus.call(this, apiResponse));
            });
    }

    /**
     * @method validate
     *
     * @returns {Promise} Promise that resolves with an object with a status property that represents if the model
     * is valid or not the fields array will return the names of the fields that are invalid.
     *
     * @description
     * This will run the validations on the properties which have validations set. Normally these validations are defined
     * through the DHIS2 schema. It will check min/max for strings/numbers etc. Additionally it will
     * run model validations against the schema.
     *
     * @example
     * myModel.validate()
     *  .then(myModelStatus => {
     *    if (myModelStatus.status === false) {
     *      myModelStatus.fields.forEach((fieldName) => console.log(fieldName));
     *    }
     * });
     */
    validate() {
        return new Promise((resolve, reject) => {
            let validationMessages = [];

            function unique(current, property) {
                if (property && current.indexOf(property) === -1) {
                    current.push(property);
                }
                return current;
            }

            function asyncRemoteValidation(model) {
                return modelValidator.validateAgainstSchema(model);
            }

            // Run async validation against the api
            asyncRemoteValidation(this)
                .catch((remoteMessages) => {
                    // Errors are ok in this case
                    if (Array.isArray(remoteMessages)) {
                        return remoteMessages;
                    }
                    return Promise.reject(remoteMessages);
                })
                .then((remoteMessages) => {
                    validationMessages = validationMessages.concat(remoteMessages);

                    const validationState = {
                        status: remoteMessages.length === 0,
                        fields: validationMessages
                            .map(validationMessage => validationMessage.property)
                            .reduce(unique, []),
                        messages: validationMessages,
                    };
                    resolve(validationState);
                })
                .catch(message => reject(message));
        });
    }

    // TODO: Cloning large graphs is very slow
    clone() {
        const modelClone = this.modelDefinition.create(
            getJSONForProperties(
                this,
                Object.keys(this.modelDefinition.modelValidations),
                true
            )
        );

        if (this.isDirty()) {
            modelClone.dirty = this.isDirty(true);
        }

        return modelClone;
    }

    delete() {
        return this.modelDefinition.delete(this);
    }

    isDirty(includeChildren = true) {
        if (!(this.dirty || (includeChildren === true && this.hasDirtyChildren()))) {
            return false;
        }
        return true;
    }

    getDirtyPropertyNames() {
        return Array.from(this[DIRTY_PROPERTY_LIST].values());
    }

    // TODO: This name is very misleading and should probably be renamed (would be a breaking change)
    getCollectionChildren() {
        // TODO: Can't be sure that this has a `modelDefinition` property
        return Object.keys(this)
            .filter(
                propertyName => this[propertyName] &&
                hasModelValidationForProperty(this, propertyName) &&
                this.modelDefinition.modelValidations[propertyName].owner
            )
            .map(propertyName => this[propertyName]);
    }

    getCollectionChildrenPropertyNames() {
        return Object
            .keys(this)
            .filter(propertyName =>
                this.modelDefinition &&
                this.modelDefinition.modelValidations &&
                this.modelDefinition.modelValidations[propertyName] &&
                this.modelDefinition.modelValidations[propertyName].type === 'COLLECTION'
            );
    }

    getReferenceProperties() {
        return Object
            .keys(this)
            .filter(propertyName =>
                this.modelDefinition &&
                this.modelDefinition.modelValidations &&
                this.modelDefinition.modelValidations[propertyName] &&
                this.modelDefinition.modelValidations[propertyName].type === 'REFERENCE' &&
                this.modelDefinition.modelValidations[propertyName].embeddedObject === false
            );
    }

    getEmbeddedObjectCollectionPropertyNames() {
        return this.getCollectionChildrenPropertyNames()
            .filter(propertyName => this.modelDefinition.modelValidations[propertyName].embeddedObject);
    }

    getDirtyChildren() {
        return this.getCollectionChildren()
            .filter(property => property && (property.dirty === true));
    }

    hasDirtyChildren() {
        return this.getDirtyChildren().length > 0;
    }

    toJSON() {
        return getJSONForProperties(this, Object.keys(this.modelDefinition.modelValidations));
    }
}

export default new ModelBase();
