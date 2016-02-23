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
     *
     * @description
     *
     * Creates a new `ModelCollectionProperty` object. This is a subclass of `ModelCollection`, which adds logic
     * for handling adding and removing elements to the collection and saving the changes to the API.
     */
    constructor(parentModel, modelDefinition, values) {
        super(modelDefinition, values, undefined);

        // Dirty bit
        this.dirty = false;
        // Keep track of added and removed elements
        this.added = new Set();
        this.removed = new Set();

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
        // TODO: Allow adding plain ID's that aren't Model instances maybe?
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
        // TODO: Allow removing plain ID's that aren't Model instances maybe?
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
        // TODO: Use Promise constructor and call resolve/reject as appropriate
        if (!this.dirty) {
            return Promise.reject('Nothing to save!');
        }

        const api = this.modelDefinition.api;

        const queries = [];

        if (this.added.size) {
            Array.from(this.added).forEach(id => {
                queries.push(api.post([this.parentModel.href, this.modelDefinition.plural, id].join('/')));
            });
        }
        if (this.removed.size) {
            Array.from(this.removed).forEach(id => {
                queries.push(api.delete([this.parentModel.href, this.modelDefinition.plural, id].join('/')));
            });
        }

        return Promise.all(queries)
            .then(() => {
                this.added = new Set();
                this.removed = new Set();
                this.updateDirty();
                return Promise.resolve();
            })
            .catch((err) => Promise.reject('Failed to alter collection:', err));
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
        return new ModelCollectionProperty(parentModel, modelDefinition, values);
    }
}


export default ModelCollectionProperty;
