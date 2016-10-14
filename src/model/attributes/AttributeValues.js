export function createAttributeValuesStore() {
    return new Map();
}

// const attributeValues = new WeakMap();
//
// console.clear();
//
// function Schema() {};
//
// const theProto = new Schema();
// let mark = Object.create(theProto);
//
// mark.name = 'value';
//
// console.log(mark.name);
//
// function addPropertyToModel(propertyName, model, schema) {
//     if (!attributeValues.has(model)) {
//         attributeValues.set(model, new Map());
//     }
//
//     const values = attributeValues.get(model);
//
//     if (Object.prototype.hasOwnProperty.call(model, propertyName)) {
//         values.set(propertyName, model[propertyName]);
//         delete model[propertyName];
//     }
//
//     Object.defineProperty(schema, propertyName, {
//         set(value) {
//             console.log(`Setting ${propertyName} to ${value}`);
//             return values.set(propertyName, value);
//         },
//
//         get() {
//             console.log(`Getting ${propertyName}`);
//             return values.get(propertyName);
//         },
//     });
// }
//
// addPropertyToModel('name', mark, theProto);
// addPropertyToModel('lastName', mark, theProto);
//
// console.log(mark.name);
// mark.name = 'Stuff';
// console.log(mark.name);
//
// mark.lastName = 'Polak';
// console.log(mark.lastName);
//
// console.log(mark);
// console.log(Array.from(attributeValues.get(mark)));
