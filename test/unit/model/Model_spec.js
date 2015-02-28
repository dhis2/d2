/* jshint expr:true */
describe('Model', () => {
    var fixtures = require('fixtures/fixtures');

    let Model = require('d2/model/Model');
    let model;

    beforeEach(() => {
        model = new Model({
            modelValidations: {},
            modelProperties: []
        }); //jshint nonew:false
    });

    it('should throw when modelDefinition is not defined', () => {
        function shouldThrow() {
            return new Model();
        }
        expect(shouldThrow).to.throw('modelDefinition should be provided');
    });

    it('should throw when modelDefinition.modelValidations is not provided', () => {
        function shouldThrow() {
            return new Model({});
        }
        expect(shouldThrow).to.throw('modelValidations should be provided');
    });

    it('should throw when modelDefinition.modelProperties is not provided', () => {
        function shouldThrow() {
            return new Model({modelValidations: {}});
        }
        expect(shouldThrow).to.throw('modelProperties should be provided');
    });

    it('should have a create method', () => {
        expect(model.create).to.be.instanceof(Function);
    });

    it('should have a save method', () => {
        expect(model.save).to.be.instanceof(Function);
    });

    it('should have a validate method', () => {
        expect(model.validate).to.be.instanceof(Function);
    });

    it('should add properties based on the modelDefinition', () => {
        let dataElementModel = Model.create(fixtures.get('modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).to.equal(34);
    });

    describe('properties based off model definition', () => {
        let modelDefinition;

        beforeEach(() => {
            modelDefinition = {
                modelValidations: {},
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
        });

        it('should call the set method for name', () => {
            modelDefinition.modelProperties.name.set = spy();
            let dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(modelDefinition.modelProperties.name.set).to.have.been.calledWith('ANC');
        });

        it('should set the correct value', () => {
            let dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(dataElementModel.dataValues.name).to.equal('ANC');
        });

        it('should call the get method for name', () => {
            modelDefinition.modelProperties.name.get = stub().returns('ANC');
            let dataElementModel = Model.create(modelDefinition);
            let name = dataElementModel.name;

            expect(modelDefinition.modelProperties.name.get).to.have.been.called;
            expect(name).to.equal('ANC');
        });

        it('should return the correct value', () => {
            let dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(dataElementModel.name).to.equal('ANC');
        });
    });

    describe('validations', () => {
        let dataElementModel;
        let modelDefinition;

        beforeEach(() => {
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

        it('should be an object', () => {
            expect(dataElementModel.validations).to.be.instanceof(Object);
        });

        it('should have a validation object for name', () => {
            let expectedNameValidationObject = {
                persisted: true,
                type: 'text',
                required: true,
                owner: true,
                min: 0,
                max: 50
            };

            expect(dataElementModel.validations.name).to.deep.equal(expectedNameValidationObject);
        });
    });
});
