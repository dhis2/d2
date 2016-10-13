import fixtures from '../../fixtures/fixtures.js';

describe('Model', () => {
    let Model = require('../../../src/model/Model');
    let model;

    beforeEach(() => {
        model = new Model({
            modelProperties: []
        });
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Model()).to.throw('Cannot call a class as a function');
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
        expect(Model.create).to.be.a('function');
    });

    it('should have a save method', () => {
        expect(model.save).to.be.a('function');
    });

    it('should have a validate method', () => {
        expect(model.validate).to.be.a('function');
    });

    it('should have a dirty property that is set to false', () => {
        expect(model.dirty).to.be.false;
    });

    it('should not show the dirty property in the enumerable properties', () => {
        let keys = Object.keys(model);

        expect(keys).not.to.include('dirty');
    });

    it('should add properties based on the modelDefinition', () => {
        // TODO: This fixture is outdated and we should update to a fixture with getters and setters.
        let dataElementModel = Model.create(fixtures.get('/modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).to.equal(34);
    });

    it('should keep a reference to its definition', () => {
        let modelDefinition = { modelProperties: [] };
        let dataElementModel = Model.create(modelDefinition);

        expect(dataElementModel.modelDefinition).to.equal(modelDefinition);
    });

    it('should not show the modelDefinition property in the enumerable properties', () => {
        let keys = Object.keys(model);

        expect(keys).not.to.include('modelDefinition');
    });

    it('should not allow the modelDefinition to be changed', () => {
        let modelDefinition = { modelProperties: [] };
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

    describe('getDirtyPropertyNames', () => {
        let dataElementModel;

        beforeEach(() => {
            const ModelDefinition = require('../../../src/model/ModelDefinition');
            let dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));

            dataElementModel = Model.create(dataElementModelDefinition);
        });

        it('should be a method', () => {
            expect(dataElementModel.getDirtyPropertyNames).to.be.instanceof(Function);
        });

        it('should return the names of properties that are dirty', () => {
            dataElementModel.name = 'ANC new';

            expect(dataElementModel.getDirtyPropertyNames()).to.deep.equal(['name']);
        });

        it('should return an empty array for a clean model', () => {
            expect(dataElementModel.getDirtyPropertyNames()).to.deep.equal([]);
        });
    });

    describe('attributes', () => {
        let dataElementModel;

        beforeEach(() => {
            const ModelDefinition = require('../../../src/model/ModelDefinition');
            let dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'), fixtures.get('/dataElementAttributes'));

            dataElementModel = Model.create(dataElementModelDefinition);
        });

        it('should not create the property when there are no attributes', () => {
            const ModelDefinition = require('../../../src/model/ModelDefinition');
            let dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));

            dataElementModel = Model.create(dataElementModelDefinition);

            expect(dataElementModel.attributes).to.be.undefined;
        });

        it('should create the property when there are attributes available', () => {
            expect(dataElementModel.attributes).to.not.be.undefined;
        });

        it('should have a property for each of the attributes that belong to this model type', () => {
            expect(Object.keys(dataElementModel.attributes)).to.deep.equal(['marktribute', 'marktribute2', 'name']);
        });

        it('should set the correct value onto the attributeValues properties', () => {
            dataElementModel.attributes.name = 'Mark';

            expect(dataElementModel.attributeValues.length).to.equal(1);
            expect(dataElementModel.attributeValues[0].value).to.equal('Mark');
            expect(dataElementModel.attributeValues[0].attribute).to.deep.equal({ id: 'S8a2OBRnqEc', name: 'name' });
        });

        it('should get the correct value from the attributeValues property', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' }
            }];

            expect(dataElementModel.attributes.marktribute).to.equal('Mark');
        });

        it('should not add a value for the same attribute twice', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' }
            }];

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.attributes.marktribute).to.equal('John');
            expect(dataElementModel.attributeValues[0].value).to.equal('John');
            expect(dataElementModel.attributeValues.length).to.equal(1);
        });

        it('should add a value for the attribute when it does not exist yet', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' }
            }];

            dataElementModel.attributes.name = 'John';

            expect(dataElementModel.attributes.marktribute).to.equal('Mark');
            expect(dataElementModel.attributes.name).to.equal('John');
            expect(dataElementModel.attributeValues[0].value).to.equal('Mark');
            expect(dataElementModel.attributeValues[1].value).to.equal('John');
            expect(dataElementModel.attributeValues.length).to.equal(2);
        });

        it('should remove the attributeValue from the attributeValue array when the value is cleared out', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' }
            }];

            dataElementModel.attributes.name = '';

            expect(dataElementModel.attributes.name).to.equal(undefined);
            expect(dataElementModel.attributeValues.length).to.equal(0);
        });

        it('should not remove the attributeValue when the attribute is set to false', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' }
            }];

            dataElementModel.attributes.name = false;

            expect(dataElementModel.attributes.name).to.equal(false);
            expect(dataElementModel.attributeValues.length).to.equal(1);
        });

        it('should not remove the attributeValue when the attribute is set 0', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' }
            }];

            dataElementModel.attributes.name = 0;

            expect(dataElementModel.attributes.name).to.equal(0);
            expect(dataElementModel.attributeValues.length).to.equal(1);
        });

        it('should remove the attributeValue when the attribute is set to undefined', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' }
            }];

            dataElementModel.attributes.name = undefined;

            expect(dataElementModel.attributes.name).to.equal(undefined);
            expect(dataElementModel.attributeValues.length).to.equal(0);
        });

        it('should remove the attributeValue when the attribute is set to null', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' }
            }];

            dataElementModel.attributes.name = null;

            expect(dataElementModel.attributes.name).to.equal(undefined);
            expect(dataElementModel.attributeValues.length).to.equal(0);
        });

        it('should not show up in the list of model keys', () => {
            const modelKeys = Object.keys(dataElementModel);

            expect(modelKeys).not.to.include('attributes');
        });

        it('should not be able to set attributes to something else', () => {
            const changeAttributesProperty = () => dataElementModel.attributes = 'something else';

            expect(changeAttributesProperty).to.throw;
            expect(dataElementModel.attributes).not.to.equal('something else');
        });

        it('should set the model to dirty when an attribute was changed', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' }
            }];

            expect(dataElementModel.dirty).to.be.false;

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.dirty).to.be.true;
        });

        it('should not set the model to be dirty when the attribute value is the same', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' }
            }];

            dataElementModel.attributes.marktribute = 'Mark';

            expect(dataElementModel.dirty).to.be.false;
        });

        it('should not fail if requesting an attribute but the model has no attributeValues', () => {
            dataElementModel.dataValues.attributeValues = undefined;

            expect(() => dataElementModel.attributes.marktribute).not.to.throw();
        });

        it('should still correctly set the attributeValue if the model has initially no attributeValues', () => {
            dataElementModel.dataValues.attributeValues = undefined;

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.attributes.marktribute).to.equal('John');
            expect(dataElementModel.attributeValues[0].attribute.id).to.equal('FpoWdhxCMwH');
        });
    });
});
