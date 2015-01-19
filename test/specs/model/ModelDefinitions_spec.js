describe('D2 models', function () {
    'use strict';
    var models;
    var ModelDefinitions = require('d2/model/ModelDefinitions');

    beforeEach(function () {
        models = new ModelDefinitions(); //jshint nonew:false
    });

    it('should be an object', function () {
        expect(models).toEqual(jasmine.any(Object));
    });

    describe('add method', function () {
        it('should be a function', function () {
            expect(models.add).toEqual(jasmine.any(Function));
        });

        it('should add a property to the models object', function () {
            models.add('dataElement');

            expect(models.dataElement).toBeDefined();
        });

        it('should throw an error when trying to add something that already exists', function () {
            function shouldThrow() {
                models.add('dataElement');
            }
            models.add('dataElement');

            expect(shouldThrow).toThrowError('Model dataElement already exists');
        });
    });
});
