import ModelValidation from 'd2/model/ModelValidation';

const modelValidator = ModelValidation.getModelValidation();

export const DIRTY_PROPERTY_LIST = Symbol('List to keep track of dirty properties');

/**
 * @class ModelBase
 */
class ModelBase {
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
     * ```js
     * myModel.save()
     *   .then((message) => console.log(message));
     * ```
     */
    save() {
        if (!this.dirty) {
            return Promise.reject('No changes to be saved');
        }

        return this.validate()
            .then(validationState => {
                if (!validationState.status) {
                    return Promise.reject(validationState);
                }

                return this.modelDefinition
                    .save(this)
                    .then((result) => {
                        this.dirty = false;
                        this[DIRTY_PROPERTY_LIST].clear();
                        return result;
                    });
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
     * ```js
     * myModel.validate()
     *  .then(myModelStatus => {
     *    if (myModelStatus.status === false) {
     *      myModelStatus.fields.forEach((fieldName) => console.log(fieldName));
     *    }
     * });
     * ```
     */
    validate() {
        return new Promise((resolve, reject) => {
            let validationMessages = [];
            let validationState;
            let modelValidationStatus = true;

            function unique(current, property) {
                if (property && current.indexOf(property) === -1) {
                    current.push(property);
                }
                return current;
            }

            function localValidation(modelValidations, dataValues) {
                let validationMessagesLocal = [];

                Object.keys(modelValidations).forEach((propertyName) => {
                    const validationStatus = modelValidator.validate(modelValidations[propertyName], dataValues[propertyName]);
                    if (!validationStatus.status) {
                        validationStatus.messages.forEach(message => {
                            message.property = propertyName;
                        });
                    }
                    modelValidationStatus = modelValidationStatus && validationStatus.status;
                    validationMessagesLocal = validationMessagesLocal.concat(validationStatus.messages || []);
                });

                return validationMessagesLocal;
            }

            function asyncRemoteValidation(model) {
                return modelValidator.validateAgainstSchema(model);
            }

            // Run local validation on the models data values
            validationMessages = validationMessages.concat(
                localValidation(this.modelDefinition.modelValidations, this.dataValues)
            );

            // Run async validation against the api
            asyncRemoteValidation(this)
                .then(remoteMessages => {
                    validationMessages = validationMessages.concat(remoteMessages);

                    validationState = {
                        status: modelValidationStatus,
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

    delete() {
        return this.modelDefinition.delete(this);
    }

    getDirtyPropertyNames() {
        return Array.from(this[DIRTY_PROPERTY_LIST].values());
    }

}

export default new ModelBase();
