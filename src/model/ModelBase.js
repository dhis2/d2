'use strict';
import ModelValidation from 'd2/model/ModelValidation';

let modelValidator = ModelValidation.getModelValidation();

class ModelBase {
    save() {
        if (this.validate().status) {
            this.modelDefinition.save(this);
        }
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
