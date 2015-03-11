'use strict';

function getFakeModelClass() {
    let proxyquire = require('proxyquire').noCallThru();

    class Model {
        constructor(id) {
            this.id = id;
        }
    }

    proxyquire('d2/model/ModelCollection', {
        'd2/model/Model': Model
    });

    return Model;
}

describe('ModelCollection', () => {
    let ModelCollection;
    let Model = getFakeModelClass();

    beforeEach(() => {
        ModelCollection = require('d2/model/ModelCollection');
    });

    it('should be an object', () => {
        expect(ModelCollection).to.be.instanceof(Function);
    });

    describe('class', () => {
        describe('create method', () => {
            it('should be a function', () => {
                expect(ModelCollection.create).to.be.instanceof(Function);
            });

            it('should return an instance of the class', () => {
                expect(ModelCollection.create()).to.be.instanceof(ModelCollection);
            });
        });
    });

    describe('instance', () => {
        let modelCollection;

        beforeEach(() => {
            modelCollection = new ModelCollection();
        });

        it('should be an instance of Map', () => {
            expect(modelCollection).to.be.instanceof(Map);
        });

        describe('add', () => {
            it('should accept Model as a value', () => {
                modelCollection.add(new Model('q2egwkkrfco'));
            });

            it('should not accept a number', () => {
                expect(() => modelCollection.add(1)).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should not accept an empty object', () => {
                expect(() => modelCollection.add({})).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should not accept an object that was created based on a local class', () => {
                class Model{
                    constructor(id) {
                        this.id = id;
                    }
                }

                expect(() => modelCollection.add(new Model('q2egwkkrfco'))).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should accept an object that was create with Model as subclass', function () {
                class MyModel extends Model{}
                let myModel = new MyModel('q2egwkkrfco');

                expect(() => modelCollection.add(myModel)).to.not.throw('Values of a ModelCollection must be instances of Model');
                expect(modelCollection.size).to.equal(1);
            });

            it('should throw if the id is not available', function () {
                expect(() => modelCollection.add(new Model())).to.throw('Can not add a Model without id to a ModelCollection');
            });
        });
    });
});
