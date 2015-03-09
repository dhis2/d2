'use strict';

class ModelBase {
    create() {

    }

    save() {
        this.modelDefinition.save(this);
    }

    validate() {

    }
}

export default new ModelBase();
