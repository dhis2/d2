describe('ModelBase', function () {
    'use strict';

    var modelBase = require('d2/model/ModelBase');

    it('should have a create method', function () {
        expect(modelBase.create).to.be.instanceof(Function);
    });

    it('should have a save method', function () {
        expect(modelBase.save).to.be.instanceof(Function);
    });

    it('should have a validate method', function () {
        expect(modelBase.validate).to.be.instanceof(Function);
    });

    describe('save', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                save: spy()
            };

            class Model{
                constructor(modelDefinition) {
                    this.modelDefinition = modelDefinition;
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
        });

        it('should call the save on the model modelDefinition with itself as a property', () => {
            model.save();

            expect(modelDefinition.save).to.have.been.called;
        });
    });
});
