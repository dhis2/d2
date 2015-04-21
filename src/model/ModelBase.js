'use strict';
import ModelValidation from 'd2/model/ModelValidation';

let modelValidator = ModelValidation.getModelValidation();

/**
 * @class ModelBase
 */
class ModelBase {
    /**
     * @method save
     *
     * @returns {Promise} Returns a promise that resolves when the model has been saved or rejects with an error message.
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

        if (this.validate().status) {
            return this.modelDefinition.save(this)
                .then(() => {
                    //TODO: check the return status of the save to see if it was actually successful and not ignored
                    this.dirty = false;
                });
        }

        return Promise.reject('Model status is not valid');
    }

    /**
     * @method validate
     *
     * @returns {{status: boolean, fields: Array}} Object with a status property that represents if the model is valid or not
     * the fields array will return the names of the fields that are invalid.
     *
     * @description
     * This will run the validations on the properties which have validations set. Normally these validations are defined
     * through the DHIS2 schema. It will check min/max for strings/numbers etc.
     *
     * ```js
     * let modelValidation = myModel.validate();
     * if (myModel.status === false) {
     *   myModel.fields.forEach((fieldName) => console.log(fieldName));
     * }
     * ```
     */
    validate() {
        let invalidFields = [];

        Object.keys(this.modelDefinition.modelValidations).forEach((propertyName) => {
            if (!modelValidator.validate(this.dataValues[propertyName], this.modelDefinition.modelValidations[propertyName])) {
                invalidFields.push(propertyName);
            }
        });

        return {
            status: !invalidFields.length,
            fields: invalidFields
        };
    }
}

export default new ModelBase();
