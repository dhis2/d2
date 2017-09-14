import Api from '../api/Api';
import ModelCollection from './ModelCollection';


/**
 * @class ModelCollectionProperty
 *
 * @description
 * A ModelCollectionProperty instance is a ModelCollection that is a property of
 * a model instance. ModelCollectionProperties can be operated on independently of
 * the Model that owns them.
 */
class ModelCollectionProperty extends ModelCollection {
    /**
     * @constructor
     *
     * @param {Model} parentModel The `Model` of the parent of this `ModelCollectionProperty`
     * @param {ModelDefinition} modelDefinition The `ModelDefinition` that this `ModelCollection` property is for
     * @param {Model[]} values Initial values that should be added to the collection property
     * @param {Api} api The class to use for API calls
     *
     * @description
     *
     * Creates a new `ModelCollectionProperty` object. This is a subclass of `ModelCollection`, which adds logic
     * for handling adding and removing elements to the collection and saving the changes to the API.
     */
    constructor(parentModel, modelDefinition, values, api) {
        super(modelDefinition, values, undefined);

        // Dirty bit
        this.dirty = false;
        // Keep track of added and removed elements
        this.added = new Set();
        this.removed = new Set();

        this.api = api;

        // Store the parent model of this collection so we can construct the URI for API calls
        this.parentModel = parentModel;
    }

    /**
     * @method add
     *
     * @param {Model} value Model instance to add to the collection.
     * @returns {ModelCollectionProperty} Returns itself for chaining purposes.
     *
     * @description
     * Calls the `add` method on the parent `ModelCollection` class, and then performs checks to keep track of
     * what, if any, changes that have been made to the collection.
     */
    add(value) {
        if (this.valuesContainerMap.has(value.id)) {
            return this;
        }

        super.add(value);

        if (this.removed.has(value.id)) {
            this.removed.delete(value.id);
        } else {
            this.added.add(value.id);
        }

        this.updateDirty();
        return this;
    }

    /**
     * @method remove
     *
     * @param {Model} value Model instance to remove from the collection.
     * @returns {ModelCollectionProperty} Returns itself for chaining purposes.
     *
     * @description
     * If the collection contains an object with the same id as the `value` parameter, that object is removed
     * from the collection. Checks are then performed to keep track of what, if any, changes that have been
     * made to the collection.
     */
    remove(value) {
        ModelCollection.throwIfContainsOtherThanModelObjects([value]);
        ModelCollection.throwIfContainsModelWithoutUid([value]);

        if (this.delete(value.id)) {
            if (this.added.has(value.id)) {
                this.added.delete(value.id);
            } else {
                this.removed.add(value.id);
            }
        }

        this.updateDirty();
        return this;
    }

    /**
     * @method updateDirty
     *
     * @returns {boolean} True if the collection has changed, false otherwise.
     *
     * @description
     * Checks whether any changes have been made to the collection, and updates the dirty flag accordingly.
     */
    updateDirty() {
        this.dirty = this.added.size > 0 || this.removed.size > 0;
        return this.dirty;
    }

    /**
     * @method resetDirtyState
     *
     * @description
     * Sets dirty=false and resets the added and removed sets used for dirty state tracking.
     */
    resetDirtyState() {
        this.dirty = false;
        this.added = new Set();
        this.removed = new Set();
    }

    /**
     * @method isDirty
     *
     * @returns {boolean} true if any elements have been added to or removed from the collection
     */
    isDirty() {
        return this.dirty;
    }

    /**
     * @method save
     *
     * @returns {Promise} A `Promise`
     *
     * @description
     * If any changes have been made to the collection, these changes will be submitted to the API. The returned
     * promise will resolve successfully when the changes have been saved to the API, and will be rejected if
     * either the changes weren't saved or if there were no changes to save.
     */
    save() {
        // Calling save when there's nothing to be saved is a no-op (not an error)
        if (!this.isDirty()) {
            return Promise.resolve({});
        }

        const url = [this.parentModel.href, this.modelDefinition.plural].join('/');
        const data = {
            additions: Array.from(this.added).map(id => ({ id })),
            deletions: Array.from(this.removed).map(id => ({ id })),
        };

        return this.api.post(url, data)
            .then(() => {
                this.resetDirtyState();
                return Promise.resolve({});
            })
            .catch(err => Promise.reject('Failed to alter collection:', err));
    }

    /**
     * @method create
     *
     * @param {Model} parentModel
     * @param {ModelDefinition} modelDefinition
     * @param {Model[]} values
     * @returns {ModelCollectionProperty}
     *
     * @description
     * See `ModelCollectionProperty.constructor`.
     */
    static create(parentModel, modelDefinition, values) {
        return new ModelCollectionProperty(parentModel, modelDefinition, values, Api.getApi());
    }
}


export default ModelCollectionProperty;
