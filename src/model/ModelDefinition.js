(function () {
    d2.ModelDefinition = ModelDefinition;

    function ModelDefinition(modelName) {
        checkType(modelName, 'string');
    }
    ModelDefinition.createFromSchema = createFromSchema;

    function createFromSchema() {

    }
})(d2);
