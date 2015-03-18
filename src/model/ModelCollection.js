import {isValidUid, isArray, checkType} from 'd2/lib/check';
import {throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';
import ModelDefinition from 'd2/model/ModelDefinition';
import Pager from 'd2/pager/Pager';

class ModelCollection {
    constructor(modelDefinition, values, pagerData) {
        checkType(modelDefinition, ModelDefinition);
        this.modelDefinition = modelDefinition;
        this.pager = new Pager(pagerData, modelDefinition);

        //We can not extend the Map object right away in v8 contexts.
        this.valuesContainerMap = new Map();
        this[Symbol.iterator] = this.valuesContainerMap[Symbol.iterator].bind(this.valuesContainerMap);

        throwIfContainsOtherThanModelObjects(values);
        throwIfContainsModelWithoutUid(values);

        //Add the values separately as not all Iterators return the same values
        if (isArray(values)) {
            values.forEach((value) => this.add(value));
        }
    }

    get size() {
        return this.valuesContainerMap.size;
    }

    add(value) {
        throwIfContainsOtherThanModelObjects([value]);
        throwIfContainsModelWithoutUid([value]);

        this.set(value.id, value);
        return this;
    }

    toArray() {
        var resultArray = [];

        this.forEach((model) => {
            resultArray.push(model);
        });

        return resultArray;
    }

    static create(modelDefinition, values, pagerData) {
        return new ModelCollection(modelDefinition, values, pagerData);
    }

    /*******************************************************************
     * Implement the map interface because extending is not yet supported in v8
     */
    clear() {
        return this.valuesContainerMap.clear.apply(this.valuesContainerMap);
    }

    delete(...args) {
        return this.valuesContainerMap.delete.apply(this.valuesContainerMap, args);
    }

    entries() {
        return this.valuesContainerMap.entries.apply(this.valuesContainerMap);
    }

    //FIXME: This calls the forEach function with the values Map and not with the ModelCollection as the third argument
    forEach(...args) {
        return this.valuesContainerMap.forEach.apply(this.valuesContainerMap, args);
    }

    get(...args) {
        return this.valuesContainerMap.get.apply(this.valuesContainerMap, args);
    }

    has(...args) {
        return this.valuesContainerMap.has.apply(this.valuesContainerMap, args);
    }

    keys() {
        return this.valuesContainerMap.keys.apply(this.valuesContainerMap);
    }

    set(...args) {
        return this.valuesContainerMap.set.apply(this.valuesContainerMap, args);
    }

    values() {
        return this.valuesContainerMap.values.apply(this.valuesContainerMap);
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
