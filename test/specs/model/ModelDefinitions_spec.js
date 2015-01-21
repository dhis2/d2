describe('D2 models', function () {
    'use strict';
    var models;
    var ModelDefinitions = require('d2/model/ModelDefinitions');

    // jscs:disable
    var ModelDefinition = function ModelDefinition(schema) {
        this.name = schema.name;
    };
    // jscs:enable

    beforeEach(function () {
        models = new ModelDefinitions(); //jshint nonew:false
    });

    it('should be an object', function () {
        expect(models).toEqual(jasmine.any(Object));
    });

    describe('add method', function () {
        var dataElementModelDefinition;

        beforeEach(function () {
            dataElementModelDefinition = new ModelDefinition({name: 'dataElement'});
        });

        it('should be a function', function () {
            expect(models.add).toEqual(jasmine.any(Function));
        });

        it('should add a property to the models object', function () {
            models.add(dataElementModelDefinition);

            expect(models.dataElement).toEqual(jasmine.any(ModelDefinition));
        });

        it('should throw an error when trying to add something that already exists', function () {
            function shouldThrow() {
                models.add(dataElementModelDefinition);
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).toThrowError('Model dataElement already exists');
        });

        it('should reject a ModelDefinition that does not have a name property', function () {
            function shouldThrow() {
                models.add({apiEndPoint: '/dataElement'});
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).toThrowError('Name should be set on the passed ModelDefinition to add one');
        });
    });

    describe('map method', function () {
        beforeEach(function () {
            models.add({name: 'dataElement'});
            models.add({name: 'dataValue'});
            models.add({name: 'user'});
            models.add({name: 'userGroup'});
        });

        it('should should be a function', function () {
            expect(models.map).toEqual(jasmine.any(Function));
        });

        it('should return an array of ModelDefinitions', function () {
            var expectedArray = [{name: 'dataElement'}, {name: 'dataValue'}, {name: 'user'}, {name: 'userGroup'}];
            function returnValue(item) {
                return item;
            }

            expect(models.map(returnValue)).toEqual(expectedArray);
        });

        it('should throw if the transformer passed is not a function', function () {
            function shouldThrowOnString() { models.map(''); }
            function shouldThrowOnObject() { models.map({}); }

            expect(shouldThrowOnString).toThrowError('string is not a function');
            expect(shouldThrowOnObject).toThrowError('object is not a function');
        });
    });
});
