import {isValidUid, isArray, checkType, isDefined} from 'd2/lib/check';
import {throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelDefinition from 'd2/model/ModelDefinition';
import Pager from 'd2/pager/Pager';

class ModelCollection {
    constructor(modelDefinition, values, pagerData) {
        checkType(modelDefinition, ModelDefinition);
        this.modelDefinition = modelDefinition;
        this.pager = new Pager(pagerData);

        //We can not extend the Map object right away in v8 contexts.
        this.__values__ = new Map();
        this[Symbol.iterator] = this.__values__[Symbol.iterator].bind(this.__values__);

        Object.defineProperty(this, 'size', {
            get: () => {return this.__values__.size},
            set: (value) => {this.__values__.size = value}
        });

        throwIfContainsOtherThanModelObjects(values);
        throwIfContainsModelWithoutUid(values);

        //Add the values separately as not all Iterators return the same values
        if (isArray(values)) {
            values.forEach((value) => this.add(value));
        }
    }

    add(value) {
        throwIfContainsOtherThanModelObjects([value]);
        throwIfContainsModelWithoutUid([value]);

        this.set(value.id, value);
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

    /*******************************************************************
     * Implement the map interface because extending is not yet supported in v8
     */
    clear(...args) {
        return this.__values__.clear.apply(this.__values__, args);
    }

    delete(...args) {
        return this.__values__.delete.apply(this.__values__, args);
    }

    entries(...args) {
        return this.__values__.entries.apply(this.__values__, args);
    }

    forEach(...args) {
        return this.__values__.forEach.apply(this.__values__, args);
    }

    get(...args) {
        return this.__values__.get.apply(this.__values__, args);
    }

    has(...args) {
        return this.__values__.has.apply(this.__values__, args);
    }

    keys(...args) {
        return this.__values__.keys.apply(this.__values__, args);
    }

    set(...args) {
        return this.__values__.set.apply(this.__values__, args);
    }

    values(...args) {
        return this.__values__.values.apply(this.__values__, args);
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
