export default class Model {
    constructor(modelDefinition) {}
}

Model.create = jest.fn((modelDefinition,...args) => {
    const model = new Model(modelDefinition,...args);

    Object.defineProperty(model, 'modelDefinition', {
        value: modelDefinition,
        enumerable: false,
    });

    Object.defineProperty(model, 'dataValues', {
        value: {},
        enumerable: false,
    });

    const propertyDescriptors = Object
        .keys(modelDefinition.modelProperties)
        .reduce((descriptors, propertyName) => {
            descriptors[propertyName] = {
                set(value) {
                    console.log(propertyName, value);
                    this.dataValues[propertyName] = value;
                },

                get() {
                    return this.dataValues[propertyName];
                },
                enumerable: true,
            };

            return descriptors;
        }, {});

    Object.defineProperties(model, propertyDescriptors);

    return model;
});
