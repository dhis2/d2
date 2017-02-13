import fixtures from '../../fixtures/fixtures';
import Api from '../../../src/api/Api';
import ModelDefinition from '../../../src/model/ModelDefinition';
import ModelCollectionProperty from '../../../src/model/ModelCollectionProperty';

describe('ModelCollectionProperty', () => {
    // let ModelCollectionProperty;
    let mockParentModel;
    let mockModelDefinition;
    let mcp;
    let testModels = [];

    before(() => {
        // ModelCollectionProperty = require('../../../src/model/ModelCollectionProperty').default;

        mockParentModel = {
            plural: 'notArealModel',
            href: 'my.dhis/instance',
        };
        mockModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
    });

    beforeEach(() => {
        mcp = ModelCollectionProperty.create(mockParentModel, mockModelDefinition, []);

        testModels.push(mockModelDefinition.create({ id: 'dataEleme01' }));
        testModels.push(mockModelDefinition.create({ id: 'dataEleme02' }));
        testModels.push(mockModelDefinition.create({ id: 'dataEleme03' }));
    });

    afterEach(() => {
        testModels = [];
    });

    it('Should be an object', () => {
        expect(ModelCollectionProperty).to.be.instanceof(Object);
    });

    it('Should not be callable as a function', () => {
        expect(() => ModelCollectionProperty()).to.throw();
    });

    describe('create()', () => {
        it('Supplies the default API implementation', () => {
            expect(mcp.api).to.deep.equal(Api.getApi());
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).to.be.false;
        });

        it('Creates empty Sets for added and removed elements', () => {
            expect(mcp.added).to.be.instanceof(Set);
            expect(mcp.removed).to.be.instanceof(Set);
            expect(mcp.added).to.be.empty;
            expect(mcp.removed).to.be.empty;
        });

        it('Sets the correct parentModel', () => {
            expect(mcp.parentModel).to.deep.equal(mockParentModel);
        });
    });

    describe('add()', () => {
        it('Registers added elements', () => {
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).to.equal(testModels.length);
        });

        it('Only registers each added element once', () => {
            testModels.forEach(model => mcp.add(model));
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).to.equal(testModels.length);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).to.be.false;
            mcp.add(testModels[0]);
            expect(mcp.dirty).to.be.true;
        });

        it('Sets the dirty flag to false when an element is added and then removed', () => {
            expect(mcp.dirty).to.be.false;
            mcp.add(testModels[0]);
            expect(mcp.dirty).to.be.true;
            mcp.remove(testModels[0]);
            expect(mcp.dirty).to.be.false;
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            // Create a new ModelCollectionProperty with existing values
            mcp = ModelCollectionProperty.create(mockParentModel, mockModelDefinition, testModels);
        });

        it('Registers removed elements', () => {
            expect(mcp.removed.size).to.equal(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).to.equal(1);
            mcp.remove(testModels[1]);
            expect(mcp.removed.size).to.equal(2);
            mcp.remove(testModels[2]);
            expect(mcp.removed.size).to.equal(3);
        });

        it('Only registers each removed element once', () => {
            expect(mcp.removed.size).to.equal(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).to.equal(1);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).to.equal(1);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).to.be.false;
            mcp.remove(testModels[0]);
            expect(mcp.dirty).to.be.true;
        });

        it('Sets the dirty flag to false when an element is removed and re-added', () => {
            expect(mcp.dirty).to.be.false;
            mcp.remove(testModels[0]);
            expect(mcp.dirty).to.be.true;
            mcp.add(testModels[0]);
            expect(mcp.dirty).to.be.false;
        });
    });

    describe('updateDirty()', () => {
        it('Updates the dirty flag correctly', () => {
            expect(mcp.updateDirty()).to.be.false;
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).to.be.true;
        });

        it('Returns the updated value of the dirty flag', () => {
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).to.equal(mcp.dirty);
        });
    });

    describe('resetDirtyState()', () => {
        it('Clears all added and removed elements', () => {
            mcp.added.add(testModels[0]);
            mcp.removed.add({ id: 'bah '});
            expect(mcp.added.size).to.equal(1);
            expect(mcp.removed.size).to.equal(1);

            mcp.resetDirtyState();
            expect(mcp.added.size).to.equal(0);
            expect(mcp.removed.size).to.equal(0);
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).to.be.false;
            mcp.add(testModels[0]);
            mcp.removed.add({ id: 'bah '});
            expect(mcp.updateDirty()).to.be.true;
            mcp.resetDirtyState();
            expect(mcp.dirty).to.be.false;
        });
    });

    describe('isDirty()', () => {
        it('Returns the current value of the dirty flag', () => {
            expect(mcp.isDirty()).to.equal(mcp.dirty);
            mcp.add(testModels[0]);
            expect(mcp.isDirty()).to.be.true;
            expect(mcp.isDirty()).to.equal(mcp.dirty);
        });

        it('Does not update the dirty flag', () => {
            expect(mcp.isDirty()).to.be.false;
            mcp.added.add(testModels[0]);
            expect(mcp.isDirty()).to.be.false;
        });
    });

    describe('save()', () => {
        let api = {
            get: sinon.stub().returns(Promise.resolve()),
            post: sinon.stub().returns(Promise.resolve()),
        };

        beforeEach(() => {
            mcp = new ModelCollectionProperty(mockParentModel, mockModelDefinition, [testModels[0]], api);
        });

        afterEach(() => {
            api.get.reset();
            api.post.reset();
        });

        it('Does nothing when the collection not dirty', done => {
            mcp.save()
                .then(() => {
                    expect(api.post.callCount).to.equal(0);
                    done();
                }).catch(e => done(e));
        });

        it('Sends additions and removals in a single request', done => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).to.not.be.called;
                    expect(api.post).to.be.calledOnce;
                    done();
                }).catch(e => done(e));
        });

        it('Uses the correct URL for requests', done => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).to.not.be.called;
                    expect(api.post).to.be.calledOnce;
                    expect(api.post).to.be.calledWith('my.dhis/instance/dataElements');
                    done();
                }).catch(e => done(e));
        });

        it('Sends the correct additions and removals', done => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.post).to.be.calledWith('my.dhis/instance/dataElements', {
                        additions: [{ id: testModels[1].id }],
                        deletions: [{ id: testModels[0].id }],
                    });
                    done();
                }).catch(e => done(e));
        });

        it('Resets the dirty flag', done => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            expect(mcp.dirty).to.be.true;
            mcp.save()
                .then(() => {
                    expect(mcp.dirty).to.be.false;
                    done();
                }).catch(e => done(e));
        });

        it('Does not throw when the API fails', done => {
            api.post.returns(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).to.be.true;
            expect(() => {
                mcp.save().then(() => done()).catch(() => done());
            }).to.not.throw();
        });

        it('Rejects the promise when the API fails', done => {
            api.post.returns(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).to.be.true;
            expect(() => {
                mcp.save().then(() => done('API failure was accepted silently')).catch(() => done());
            }).to.not.throw();
        });
    });
});