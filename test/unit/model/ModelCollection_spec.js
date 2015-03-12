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

    proxyquire('d2/model/ModelCollection', {
        'd2/model/Model': Model,
        'd2/model/ModelDefinition': ModelDefinition,
        'd2/pager/Pager': Pager
    });

    return [Model, ModelDefinition, Pager];
}

describe('ModelCollection', () => {
    let pagerObject;
    let ModelCollection;
    let [Model, ModelDefinition, Pager] = getFakeModelClass();

    beforeEach(() => {
        pagerObject = {
            page: 1,
            pageCount: 10,
            total: 482,
            nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2'
        };

        Pager.reset();
        Pager.returns(pagerObject);

        ModelDefinition.prototype.list = stub().returns(new Promise(() => {}));
        ModelCollection = require('d2/model/ModelCollection');
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
        });
    });

    describe('instance', () => {
        let modelDefinition;
        let modelCollection;

        beforeEach(() => {
            modelDefinition = new ModelDefinition();
            modelCollection = new ModelCollection(modelDefinition);
        });

        it('should be an instance of Map', () => {
            expect(modelCollection).to.be.instanceof(Map);
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

            firstValue = modelCollection[Symbol.iterator]().next().value[1];

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
                class Model{
                    constructor(id) {
                        this.id = id;
                    }
                }

                expect(() => modelCollection.add(new Model('q2egwkkrfco'))).to.throw('Values of a ModelCollection must be instances of Model');
            });

            it('should accept an object that was create with Model as subclass', () => {
                class MyModel extends Model{}
                let myModel = new MyModel('q2egwkkrfco');

                expect(() => modelCollection.add(myModel)).to.not.throw('Values of a ModelCollection must be instances of Model');
                expect(modelCollection.size).to.equal(1);
            });

            it('should throw if the id is not available', () => {
                expect(() => modelCollection.add(new Model())).to.throw('Can not add a Model without id to a ModelCollection');
            });
        });

        describe('nextPage', () => {
            it('should be a method on the collection', () => {
                expect(modelCollection.nextPage).to.be.instanceof(Function);
            });

            it('should return a promise', () => {
                expect(modelCollection.nextPage()).to.be.instanceof(Promise);
            });

            it('should call the model definition for a new list', () => {
                modelCollection.nextPage();

                expect(modelDefinition.list).to.be.called;
            });

            it('should only ask for a new list if the pager has a nextPage property', () => {
                delete pagerObject.nextPage;
                modelCollection.nextPage();

                expect(modelDefinition.list).to.not.be.called;
            });

            it('should return a rejected promise if there are no more new pages', (done) => {
                delete pagerObject.nextPage;

                modelCollection.nextPage()
                    .catch((message) => {
                        expect(message).to.equal('There is no next page for this collection');
                        done();
                    });
            });

            it('should call next page with the current page number + 1', () => {
                modelCollection.nextPage();

                expect(modelDefinition.list).to.be.calledWith({page: 2});
            });
        });

        describe('hasNextPage', () => {
            it('should be a function', () => {
                expect(modelCollection.hasNextPage).to.be.instanceof(Function);
            });

            it('should return true if there is a next page', () => {
                expect(modelCollection.hasNextPage()).to.be.true;
            });

            it('should return false if there is no next page', () => {
                delete pagerObject.nextPage;

                expect(modelCollection.hasNextPage()).to.be.false;
            });
        });

        describe('previousPage', () => {
            it('should be a method on the collection', () => {
                expect(modelCollection.previousPage).to.be.instanceof(Function);
            });

            it('should return a promise', () => {
                expect(modelCollection.previousPage()).to.be.instanceof(Promise);
            });

            it('should ask for the previous page if the prevPage property is set', () => {
                pagerObject.prevPage = 'http://url.to.the.next.page';

                modelCollection.previousPage();

                expect(modelDefinition.list).to.be.called;
            });

            it('should not ask for a new list if there is no previous page', () => {
                modelCollection.previousPage();

                expect(modelDefinition.list).to.not.be.called;
            });

            it('should return a rejected promise if there are no more previous pages', (done) => {
                modelCollection.previousPage()
                    .catch((message) => {
                        expect(message).to.equal('There is no previous page for this collection');
                        done();
                    });
            });

            it('should call the list method with the current page number - 1', () => {
                pagerObject.page = 3;
                pagerObject.prevPage = 'http://url.to.the.next.page';

                modelCollection.previousPage();

                expect(modelDefinition.list).to.be.calledWith({page: 2})
            });
        });

        describe('hasPreviousPage', () => {
            it('should be a function', () => {
                expect(modelCollection.hasPreviousPage).to.be.instanceof(Function);
            });

            it('should return true if there is a next page', () => {
                expect(modelCollection.hasPreviousPage()).to.be.true;
            });

            it('should return false if there is no next page', () => {
                delete pagerObject.nextPage;

                expect(modelCollection.hasPreviousPage()).to.be.false;
            });
        });
    });
});
