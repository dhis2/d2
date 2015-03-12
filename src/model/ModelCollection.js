import {isValidUid, isArray, checkType, isDefined} from 'd2/lib/check';
import {throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelDefinition from 'd2/model/ModelDefinition';
import Pager from 'd2/pager/Pager';

class ModelCollection extends Map {
    constructor(modelDefinition, values, pagerData) {
        checkType(modelDefinition, ModelDefinition);
        this.modelDefinition = modelDefinition;
        this.pager = new Pager(pagerData);

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
        if (this.pager.nextPage) {
            return this.modelDefinition.list({page: this.pager.page + 1});
        }
        return Promise.reject('There is no next page for this collection');
    }

    hasNextPage() {
        return isDefined(this.pager.nextPage);
    }

    previousPage() {
        if (this.pager.prevPage) {
            return this.modelDefinition.list({page: this.pager.page - 1});
        }
        return Promise.reject('There is no previous page for this collection');
    }

    hasPreviousPage() {
        return isDefined(this.pager.nextPage);
    }

    static create(modelDefinition, values, pagerData) {
        return new ModelCollection(modelDefinition, values, pagerData);
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
