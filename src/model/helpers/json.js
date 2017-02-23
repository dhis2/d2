const NON_MODEL_COLLECTIONS = new Set([
    'compulsoryDataElementOperands',
    'greyedFields',
    'aggregationLevels',
    'grantTypes',
    'translations',
    'deliveryChannels',
    'redirectUris',
    'dataSetElements',
    'dataInputPeriods',
    'userGroupAccesses',
    'userAccesses',
]);

function isPlainValue(collection) {
    return function isPlainValueInCollection(property) {
        return collection.indexOf(property) === -1;
    };
}

function isCollectionProperty(collection) {
    return property => !isPlainValue(collection)(property);
}

export function getJSONForProperties(model, properties) {
    const objectToSave = {};
    const collectionProperties = model
        .getCollectionChildrenPropertyNames()
        // Even though attributeValues are considered collections, they are handled separately due to their
        // difference in structure.
        .filter(propertyName => propertyName !== 'attributeValues');

    const propertyNames = Object.keys(model.modelDefinition.modelValidations)
        .filter(propertyName => properties.indexOf(propertyName) >= 0)
        .filter(propertyName => (
            model.dataValues[propertyName] !== undefined &&
            model.dataValues[propertyName] !== null)
        );

    // Handle plain values
    propertyNames
        .filter(isPlainValue(collectionProperties))
        .forEach((propertyName) => {
            objectToSave[propertyName] = model.dataValues[propertyName];
        });

    // Handle Collection properties
    propertyNames
        .filter(isCollectionProperty(collectionProperties))
        .forEach((propertyName) => {
            // compulsoryDataElementOperands and greyedFields are not arrays of models.
            // TODO: This is not the proper way to do this. We should check if the array contains Models
            if (NON_MODEL_COLLECTIONS.has(propertyName)) {
                objectToSave[propertyName] = Array.from(model.dataValues[propertyName]);
                return;
            }

            const values = Array.isArray(model.dataValues[propertyName]) ?
                model.dataValues[propertyName] : Array.from(model.dataValues[propertyName].values());

            // Transform an object collection to an array of objects with id properties
            objectToSave[propertyName] = values
                .filter(value => value.id)
                .map((childModel) => {
                    // Legends can be saved as part of the LegendSet object.
                    // To make this work properly we will return all of the properties for the items in the collection
                    // instead of just the `id` fields
                    if (model.modelDefinition && model.modelDefinition.name === 'legendSet' && propertyName === 'legends') {
                        return getOwnedPropertyJSON.call(childModel.modelDefinition, childModel); // eslint-disable-line no-use-before-define
                    }

                    // For any other types we return an object with just an id
                    return { id: childModel.id };
                });
        });

    return objectToSave;
}

export function getOwnedPropertyJSON(model) {
    const ownedProperties = model.modelDefinition.getOwnedPropertyNames();

    return getJSONForProperties(model, ownedProperties);
}
