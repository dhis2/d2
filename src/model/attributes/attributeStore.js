import { createAttributeValuesStore } from './AttributeValues';

const attributeStore = new WeakMap();

function createAttributeValueStoreWhenNotExists(model) {
    if (!attributeStore.has(model)) {
        attributeStore.set(model, createAttributeValuesStore());
    }
}

export default {
    getAttributesFor(model) {
        if (attributeStore.has(model)) {
            return attributeStore.get(model);
        }

        return new WeakMap();
    },

    setAttributesFor(model, attributes) {
        attributeStore.set(model, attributes);

        return this;
    },

    getAttributeValueFor(model, attribute) {
        createAttributeValueStoreWhenNotExists(model);

        return attributeStore.get(model).get(attribute);
    },

    setAttributeValueFor(model, attribute, value) {
        createAttributeValueStoreWhenNotExists(model);

        return attributeStore.get(model).set(attribute, value);
    },
};
