describe('Model', function () {
    var Model = d2.Model;
    var model;

    beforeEach(function () {
        model = new Model(); //jshint nonew:false
    });

    it('should have a create method', function () {
        expect(model.create).toEqual(jasmine.any(Function));
    });

    it('should have a save method', function () {
        expect(model.save).toEqual(jasmine.any(Function));
    });

    it('should have a validate method', function () {
        expect(model.validate).toEqual(jasmine.any(Function));
    });

    it('should add properties based on the modelDefinition', function () {
        var dataElementModel = Model.create(fixtures.get('modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).toBe(34);
    });

    describe('properties based off model definition', function () {
        var modelDefinition;

        beforeEach(function () {
            modelDefinition = {
                modelProperties: {
                    name: {
                        configurable: false,
                        enumerable: true,
                        get: function () {
                            return this.dataValues.name;
                        },
                        set: function (value) {
                            this.dataValues.name = value;
                        }
                    }
                }
            };

            spyOn(modelDefinition.modelProperties.name, 'get').and.callThrough();
            spyOn(modelDefinition.modelProperties.name, 'set').and.callThrough();
        });

        it('should call the set method for name', function () {
            var dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(modelDefinition.modelProperties.name.set).toHaveBeenCalledWith('ANC');
            expect(dataElementModel.dataValues.name).toEqual('ANC');
        });

        it('should call the get method for name', function () {
            var dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(dataElementModel.name).toEqual('ANC');
            expect(modelDefinition.modelProperties.name.get).toHaveBeenCalled();
        });
    });

    describe('validations', function () {
        var dataElementModel;
        var modelDefinition;

        beforeEach(function () {
            modelDefinition = {
                modelProperties: {
                    name: {
                        configurable: false,
                        enumerable: true,
                        get: function () {
                            return this.dataValues.name;
                        },
                        set: function (value) {
                            this.dataValues.name = value;
                        }
                    }
                },
                modelValidations: {
                    name: {
                        persisted: true,
                        type: 'text',
                        required: true,
                        owner: true,
                        min: 0,
                        max: 50
                    }
                }
            };

            dataElementModel = Model.create(modelDefinition);
        });

        it('should be an object', function () {
            expect(dataElementModel.validations).toEqual(jasmine.any(Object));
        });

        it('should have a validation object for name', function () {
            var expectedNameValidationObject = {
                persisted: true,
                type: 'text',
                required: true,
                owner: true,
                min: 0,
                max: 50
            };

            expect(dataElementModel.validations.name).toEqual(expectedNameValidationObject);
        });
    });
});
