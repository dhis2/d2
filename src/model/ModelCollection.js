import {isValidUid, isArray, checkType} from 'd2/lib/check';
import {throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelDefinition from 'd2/model/ModelDefinition';

class ModelCollection extends Map {
    constructor(modelDefinition, values) {
        checkType(modelDefinition, ModelDefinition);
        this.modelDefinition = modelDefinition;

        throwIfContainsOtherThanModelObjects(values);
        throwIfContainsModelWithoutUid(values);

        super();

        //Add the values separately as not all Iterators return the same values
        if (isArray(values)) {
            values.forEach((value) => this.add(value));
        }
    }

    add(value) {
        throwIfContainsOtherThanModelObjects([value]);
        throwIfContainsModelWithoutUid([value]);

        super.set(value.id, value);
        return this;
    }

    nextPage() {

    }

    previousPage() {

    }

    static create(modelDefinition) {
        return new ModelCollection(modelDefinition);
    }
}

function throwIfContainsOtherThanModelObjects(values) {
    if (values && values[Symbol.iterator]) {
        let toCheck = [...values];
        toCheck.forEach((value) => {
            if (!(value instanceof Model)) {
                throwError('Values of a ModelCollection must be instances of Model');
            }
        });
    }
}

function throwIfContainsModelWithoutUid(values) {
    if (values && values[Symbol.iterator]) {
        let toCheck = [...values];
        toCheck.forEach((value) => {
            if (!isValidUid(value.id)) {
                throwError('Can not add a Model without id to a ModelCollection');
            }
        });
    }
}

export default ModelCollection;
