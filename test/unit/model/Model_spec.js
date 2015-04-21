import fixtures from '../../fixtures/fixtures.js';

describe('Model', () => {
    'use strict';

    let Model = require('d2/model/Model');
    let model;

    beforeEach(() => {
        model = new Model({
            modelProperties: []
        });
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Model()).to.throw('Cannot call a class as a function'); //jshint ignore:line
    });

    it('should throw when modelDefinition is not defined', () => {
        function shouldThrow() {
            return new Model();
        }
        expect(shouldThrow).to.throw('modelDefinition should be provided');
    });

    it('should throw when modelDefinition.modelProperties is not provided', () => {
        function shouldThrow() {
            return new Model({});
        }
        expect(shouldThrow).to.throw('modelProperties should be provided');
    });

    it('should have a create method on the class', () => {
        expect(Model.create).to.be.instanceof(Function);
    });

    it('should have a save method', () => {
        expect(model.save).to.be.instanceof(Function);
    });

    it('should have a validate method', () => {
        expect(model.validate).to.be.instanceof(Function);
    });

    it('should have a dirty property that is set to false', () => {
        expect(model.dirty).to.be.false;
    });

    it('should not show the dirty property in the enumerable properties', () => {
        let keys = Object.keys(model);

        expect(keys).not.to.include('dirty');
    });

    it('should add properties based on the modelDefinition', () => {
        //TODO: This fixture is outdated and we should update to a fixture with getters and setters.
        let dataElementModel = Model.create(fixtures.get('modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).to.equal(34);
    });

    it('should keep a reference to its definition', () => {
        let modelDefinition = {modelProperties: []};
        let dataElementModel = Model.create(modelDefinition);

        expect(dataElementModel.modelDefinition).to.equal(modelDefinition);
    });

    it('should not show the modelDefinition property in the enumerable properties', () => {
        let keys = Object.keys(model);

        expect(keys).not.to.include('modelDefinition');
    });

    it('should not allow the modelDefinition to be changed', () => {
        let modelDefinition = {modelProperties: []};
        let dataElementModel = Model.create(modelDefinition);

        function shouldThrow() {
            dataElementModel.modelDefinition = {};
        }

        expect(shouldThrow).to.throw();
    });

    describe('properties based off model definition', () => {
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
});
