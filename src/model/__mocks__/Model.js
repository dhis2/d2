export default class Model {}

Model.create = jest.fn(modelDefinition => {
    const model = new Model()

    Object.defineProperty(model, 'modelDefinition', {
        value: modelDefinition,
        enumerable: false,
    })

    Object.defineProperty(model, 'dataValues', {
        value: {},
        enumerable: false,
    })

    const propertyDescriptors = Object.keys(
        modelDefinition.modelProperties
    ).reduce((descriptors, propertyName) => {
        descriptors[propertyName] = {
            set(value) {
                this.dataValues[propertyName] = value
            },

            get() {
                return this.dataValues[propertyName]
            },
            enumerable: true,
        }

        return descriptors
    }, {})

    Object.defineProperties(model, propertyDescriptors)

    return model
})
