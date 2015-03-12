'use strict';
import ModelValidation from 'd2/model/ModelValidation';

let modelValidator = ModelValidation.getModelValidation();

class ModelBase {
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

    validate() {
        let invalidFields = [];

        Object.keys(this.validations).forEach((propertyName) => {
            if (!modelValidator.validate(this.dataValues[propertyName], this.validations[propertyName])) {
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
