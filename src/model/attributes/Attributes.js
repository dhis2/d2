/**
 * Stores the attribute definitions as received from /api/attributes
 * This can therefore be used as a single source to determine what attributes are
 * linked to which models.
 */
export default class Attributes {
    constructor(attributes = []) {
        if (Array.isArray(attributes)) {
            this.__attributes = new Set(attributes);
        }

        if (attributes.attributes && Array.isArray(attributes.attributes)) {
            this.__attributes = new Set(attributes.attributes);
        }
    }

    get attributes() {
        return Array.from(this.__attributes.values());
    }

    getAttributesForSchema(schema) {
        return Array
            .from(this.__attributes.values())
            .filter(attribute => attribute[`${schema.singular}Attribute`] === true);
    }
}

export function getAttributes(attributes = []) {
    if (!getAttributes.attributes) {
        getAttributes.attributes = new Attributes(attributes);
    }

    return getAttributes.attributes;
}
