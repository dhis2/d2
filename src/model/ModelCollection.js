import { isValidUid, isArray, checkType } from '../lib/check';
import { throwError } from '../lib/utils';
import Model from './Model';
import ModelDefinition from './ModelDefinition';
import Pager from '../pager/Pager';

function throwIfContainsOtherThanModelObjects(values) {
    if (values && values[Symbol.iterator]) {
        const toCheck = [...values];
        toCheck.forEach((value) => {
            if (!(value instanceof Model)) {
                throwError('Values of a ModelCollection must be instances of Model');
            }
        });
    }
}

function throwIfContainsModelWithoutUid(values) {
    if (values && values[Symbol.iterator]) {
        const toCheck = [...values];
        toCheck.forEach((value) => {
            if (!isValidUid(value.id)) {
                throwError('Can not add a Model without id to a ModelCollection');
            }
        });
    }
}

/**
 * @class ModelCollection
 *
 * @description
 * Collection of `Model` objects that can be interacted upon. Can contain a pager object to easily navigate
 * pages within the system.
 */
class ModelCollection {

    /**
     * @constructor
     *
     * @param {ModelDefinition} modelDefinition The `ModelDefinition` that this collection is for. This defines the type of models that
     * are allowed to be added to the collection.
     * @param {Model[]} values Initial values that should be added to the collection.
     * @param {Object} pagerData Object with pager data. This object contains data that will be put into the `Pager` instance.
     *
     * @description
     *
     * Creates a new `ModelCollection` object based on the passed `modelDefinition`. Additionally values can be added by passing
     * `Model` objects in the `values` parameter. The collection also exposes a pager object which can be used to navigate through
     * the pages in the collection. For more information see the `Pager` class.
     */
    constructor(modelDefinition, values, pagerData) {
        checkType(modelDefinition, ModelDefinition);
        /**
         * @property {ModelDefinition} modelDefinition The `ModelDefinition` that this collection is for. This defines the type of models that
         * are allowed to be added to the collection.
         */
        this.modelDefinition = modelDefinition;

        /**
         * @property {Pager} pager Pager object that is created from the pagerData that was passed when the collection was constructed. If no pager data was present
         * the pager will have default values.
         */
        this.pager = new Pager(pagerData, modelDefinition);

        // We can not extend the Map object right away in v8 contexts.
        this.valuesContainerMap = new Map();
        this[Symbol.iterator] = this.valuesContainerMap[Symbol.iterator].bind(this.valuesContainerMap);

        throwIfContainsOtherThanModelObjects(values);
        throwIfContainsModelWithoutUid(values);

        // Add the values separately as not all Iterators return the same values
        if (isArray(values)) {
            values.forEach(value => this.valuesContainerMap.set(value.id, value));
        }
    }

    /**
     * @property {Number} size The number of Model objects that are in the collection.
     *
     * @description
     * Contains the number of Model objects that are in this collection. If the collection is a collection with a pager. This
     * does not take into account all the items in the database. Therefore when a pager is present on the collection
     * the size will return the items on that page. To get the total number of items consult the pager.
     */
    get size() {
        return this.valuesContainerMap.size;
    }

    /**
     * @method add
     *
     * @param {Model} value Model instance to add to the collection.
     * @returns {ModelCollection} Returns itself for chaining purposes.
     *
     * @throws {Error} When the passed value is not an instance of `Model`
     * @throws {Error} Throws error when the passed value does not have a valid id.
     *
     * @description
     * Adds a Model instance to the collection. The model is checked if it is a correct instance of `Model` and if it has
     * a valid id. A valid id is a uid string of 11 alphanumeric characters.
     */
    add(value) {
        throwIfContainsOtherThanModelObjects([value]);
        throwIfContainsModelWithoutUid([value]);

        this.set(value.id, value);
        return this;
    }

    /**
     * @method toArray
     *
     * @returns {Array} Returns the values of the collection as an array.
     *
     * @description
     * If working with the Map type object is inconvenient this method can be used to return the values
     * of the collection as an Array object.
     */
    toArray() {
        const resultArray = [];

        this.forEach((model) => {
            resultArray.push(model);
        });

        return resultArray;
    }

    static create(modelDefinition, values, pagerData) {
        return new ModelCollection(modelDefinition, values, pagerData);
    }

    static throwIfContainsOtherThanModelObjects(value) {
        return throwIfContainsOtherThanModelObjects(value);
    }

    static throwIfContainsModelWithoutUid(value) {
        return throwIfContainsModelWithoutUid(value);
    }

    /**
     * @method clear
     *
     * @returns {this} Returns itself for chaining purposes;
     *
     * @description
     * Clear the collection and remove all it's values.
     */
    // TODO: Reset the pager?
    clear() {
        return this.valuesContainerMap.clear.apply(this.valuesContainerMap);
    }

    delete(...args) {
        return this.valuesContainerMap.delete.apply(this.valuesContainerMap, args);
    }

    entries() {
        return this.valuesContainerMap.entries.apply(this.valuesContainerMap);
    }

    // FIXME: This calls the forEach function with the values Map and not with the ModelCollection as the third argument
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

export default ModelCollection;
