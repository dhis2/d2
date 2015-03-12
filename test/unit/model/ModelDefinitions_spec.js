import ModelDefinitions from '../../../src/model/ModelDefinitions.js';

describe('D2 models', () => {
    'use strict';

    var models;

    class ModelDefinition {
        constructor(schema) {
            this.name = schema.name;
        }
    }

    beforeEach(() => {
        models = new ModelDefinitions(); //jshint nonew:false
    });

    it('should be an object', () => {
        expect(models).to.be.instanceof(Object);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelDefinitions()).to.throw('Cannot call a class as a function'); //jshint ignore:line
    });

    describe('add method', () => {
        var dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = new ModelDefinition({name: 'dataElement'});
        });

        it('should be a function', () => {
            expect(models.add).to.be.instanceof(Function);
        });

        it('should add a property to the models object', () => {
            models.add(dataElementModelDefinition);

            expect(models.dataElement).to.be.instanceof(ModelDefinition);
        });

        it('should throw an error when trying to add something that already exists', () => {
            function shouldThrow() {
                models.add(dataElementModelDefinition);
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).to.throw('Model dataElement already exists');
        });

        it('should reject a ModelDefinition that does not have a name property', () => {
            function shouldThrow() {
                models.add({apiEndPoint: '/dataElement'});
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).to.throw('Name should be set on the passed ModelDefinition to add one');
        });
    });

    describe('mapThroughDefinitions method', () => {
        beforeEach(() => {
            models.add({name: 'dataElement'});
            models.add({name: 'dataValue'});
            models.add({name: 'user'});
            models.add({name: 'userGroup'});
        });

        it('should should be a function', () => {
            expect(models.mapThroughDefinitions).to.be.instanceof(Function);
        });

        it('should return an array of ModelDefinitions', () => {
            var expectedArray = [{name: 'dataElement'}, {name: 'dataValue'}, {name: 'user'}, {name: 'userGroup'}];
            function returnValue(item) {
                return item;
            }

            expect(models.mapThroughDefinitions(returnValue)).to.deep.equal(expectedArray);
        });

        it('should throw if the transformer passed is not a function', () => {
            function shouldThrowOnString() { models.mapThroughDefinitions(''); }
            function shouldThrowOnObject() { models.mapThroughDefinitions({}); }

            expect(shouldThrowOnString).to.throw('string is not a function');
            expect(shouldThrowOnObject).to.throw('object is not a function');
        });
    });
});
