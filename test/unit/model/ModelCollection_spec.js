'use strict';

function getFakeModelClass() {
    let proxyquire = require('proxyquire').noCallThru();

    class Model {
        constructor(id) {
            this.id = id;
        }
    }

    class ModelDefinition {

    }

    let Pager = sinon.stub();

    proxyquire('../../../src/model/ModelCollection', {
        './Model': Model,
        './ModelDefinition': ModelDefinition,
        '../pager/Pager': Pager
    });

    return [Model, ModelDefinition, Pager];
}

describe('ModelCollection', () => {
    const [Model, ModelDefinition, Pager] = getFakeModelClass();
    let pagerObject;
    let ModelCollection;

    beforeEach(() => {
        pagerObject = {
            page: 1,
            pageCount: 10,
            total: 482,
            nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2'
        };

        Pager.reset();
        Pager.returns(pagerObject);

        ModelCollection = require('../../../src/model/ModelCollection');
    });

    describe('extension of Map', () => {
        let firstValue;
        let modelCollection;

        beforeEach(() => {
            firstValue = new Model('q2egwkkrfco');

            modelCollection = ModelCollection.create(new ModelDefinition());
            modelCollection.add(firstValue);
        });

        it('should have a clear method that clears the list', () => {
            modelCollection.clear();

            expect(modelCollection.size).to.equal(0);
        });

        it('should get the values', () => {
            expect([...modelCollection.values()][0]).to.equal(firstValue);
        });

        it('should get the keys', () => {
            expect([...modelCollection.keys()][0]).to.equal('q2egwkkrfco');
        });

        it('should run the forEach with the correct values', () => {
            let forEachFunc = spy();

            modelCollection.forEach(forEachFunc);

            expect(forEachFunc).to.be.calledWith(firstValue, 'q2egwkkrfco', modelCollection.valuesContainerMap);
        });

        it('should remove the correct value', () => {
            modelCollection.delete('q2egwkkrfco');

            expect(modelCollection.size).to.equal(0);
        });

        it('should get the entries', () => {
            expect([...modelCollection.entries()][0]).to.deep.equal(['q2egwkkrfco', firstValue]);
        });

        it('should return true when the entry is in the collection', () => {
            expect(modelCollection.has('q2egwkkrfco')).to.be.true;
        });

        it('should return the correct value on get', () => {
            expect(modelCollection.get('q2egwkkrfco')).to.equal(firstValue);
        });

        it('should throw error when trying to set the size', () => {
            expect(() => modelCollection.size = 0).to.throw();
        });
    });

    it('should be an object', () => {
        expect(ModelCollection).to.be.instanceof(Function);
    });

    it('should accept 3 arguments', () => {
        expect(ModelCollection.length).to.equal(3);
    });

    describe('class', () => {
        describe('create method', () => {
            it('should be a function', () => {
                expect(ModelCollection.create).to.be.instanceof(Function);
            });

            it('should return an instance of the class', () => {
                expect(ModelCollection.create(new ModelDefinition())).to.be.instanceof(ModelCollection);
            });

            it('should instantiate a new pager', () => {
                ModelCollection.create(new ModelDefinition());

                expect(Pager).to.be.calledWithNew;
            });

            it('should not be allowed to be called without new', () => {
                expect(() => ModelCollection()).to.throw('Cannot call a class as a function');
            });
        });

        describe('throwIfContainsOtherThanModelObjects', () => {
            it('should throw when one of the the passed values in the array is not a Model', () => {
                expect(() => ModelCollection.throwIfContainsOtherThanModelObjects([{}])).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should not throw when the passed value is a model', () => {
                expect(() => ModelCollection.throwIfContainsOtherThanModelObjects([new Model()])).not.to.throw();
            });
        });

        describe('throwIfContainsModelWithoutUid', () => {
            it('should throw when the passed array contains a modelWithoutId', () => {
                expect(() => ModelCollection.throwIfContainsModelWithoutUid([new Model()])).to.throw('Can not add a Model without id to a ModelCollection');
            });

            it('should accept models with valid UIDs', () => {
                const model = new Model();

                model.id = 'FQ2o8UBlcrS';

                expect(() => ModelCollection.throwIfContainsModelWithoutUid([model])).not.to.throw();
            });
        });
    });

    describe('instance', () => {
        let modelDefinition;
        let modelCollection;

        beforeEach(() => {
            modelDefinition = new ModelDefinition();
            modelCollection = new ModelCollection(modelDefinition);
        });

        it('should throw if being constructed with non Model values', () => {
            expect(() => new ModelCollection(modelDefinition, [1, 2, 3])).to.throw('Values of a ModelCollection must be instances of Model');
        });

        it('should accept an array of Model objects', () => {
            modelCollection = new ModelCollection(modelDefinition, [new Model('q2egwkkrfc1'), new Model('q2egwkkrfc2'), new Model('q2egwkkrfc3')]);

            expect(modelCollection.size).to.equal(3);
        });

        it('should not add the same model twice', () => {
            modelCollection = new ModelCollection(modelDefinition, [new Model('q2egwkkrfc1'), new Model('q2egwkkrfc1')]);

            expect(modelCollection.size).to.equal(1);
        });

        it('should return the first Model', () => {
            let firstModel = new Model('q2egwkkrfc1');
            let firstValue;

            modelCollection = new ModelCollection(modelDefinition, [firstModel, new Model('q2egwkkrfc1')]);

            // firstValue = modelCollection[Symbol.iterator]().next().value[1];
            firstValue = modelCollection.get('q2egwkkrfc1');

            expect(firstValue).to.deep.equal(firstModel);
            expect(firstValue).to.be.instanceof(Model);
        });

        it('should set the modelDefinition onto the modelCollection', () => {
            expect(modelCollection.modelDefinition).to.equal(modelDefinition);
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
                class Model {
                    constructor(id) {
                        this.id = id;
                    }
                }

                expect(() => modelCollection.add(new Model('q2egwkkrfco'))).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should accept an object that was create with Model as subclass', () => {
                class MyModel extends Model {}
                const myModel = new MyModel('q2egwkkrfco');

                expect(() => modelCollection.add(myModel)).to.not.throw('Values of a ModelCollection must be instances of Model');
                expect(modelCollection.size).to.equal(1);
            });

            it('should throw if the id is not available', () => {
                expect(() => modelCollection.add(new Model())).to.throw('Can not add a Model without id to a ModelCollection');
            });
        });

        describe('toArray', () => {
            it('should return an array of the items', () => {
                const modelArray = [new Model('someohterid'), new Model('q2egwkkrfc1')];

                modelCollection = new ModelCollection(modelDefinition, modelArray);

                expect(modelCollection.toArray()).to.deep.equal(modelArray);
            });
        });
    });
});
