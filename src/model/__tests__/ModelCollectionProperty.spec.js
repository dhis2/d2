import fixtures from '../../__fixtures__/fixtures';
import Api from '../../api/Api';
import ModelDefinition from '../ModelDefinition';
import ModelCollectionProperty from '../ModelCollectionProperty';

describe('ModelCollectionProperty', () => {
    // let ModelCollectionProperty;
    let mockParentModel;
    let mockModelDefinition;
    let mcp;
    let testModels = [];

    beforeEach(() => {
        // ModelCollectionProperty = require('../ModelCollectionProperty').default;

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
        expect(ModelCollectionProperty).toBeInstanceOf(Object);
    });

    it('Should not be callable as a function', () => {
        expect(() => ModelCollectionProperty()).toThrowError();
    });

    describe('create()', () => {
        it('Supplies the default API implementation', () => {
            expect(mcp.api).toEqual(Api.getApi());
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).toBe(false);
        });

        it('Creates empty Sets for added and removed elements', () => {
            expect(mcp.added).toBeInstanceOf(Set);
            expect(mcp.removed).toBeInstanceOf(Set);
            expect(mcp.added.size).toBe(0);
            expect(mcp.removed.size).toBe(0);
        });

        it('Sets the correct parentModel', () => {
            expect(mcp.parentModel).toEqual(mockParentModel);
        });
    });

    describe('add()', () => {
        it('Registers added elements', () => {
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).toBe(testModels.length);
        });

        it('Only registers each added element once', () => {
            testModels.forEach(model => mcp.add(model));
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).toBe(testModels.length);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(true);
        });

        it('Sets the dirty flag to false when an element is added and then removed', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(true);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            // Create a new ModelCollectionProperty with existing values
            mcp = ModelCollectionProperty.create(mockParentModel, mockModelDefinition, testModels);
        });

        it('Registers removed elements', () => {
            expect(mcp.removed.size).toBe(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
            mcp.remove(testModels[1]);
            expect(mcp.removed.size).toBe(2);
            mcp.remove(testModels[2]);
            expect(mcp.removed.size).toBe(3);
        });

        it('Only registers each removed element once', () => {
            expect(mcp.removed.size).toBe(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).toBe(false);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(true);
        });

        it('Sets the dirty flag to false when an element is removed and re-added', () => {
            expect(mcp.dirty).toBe(false);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(true);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('updateDirty()', () => {
        it('Updates the dirty flag correctly', () => {
            expect(mcp.updateDirty()).toBe(false);
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).toBe(true);
        });

        it('Returns the updated value of the dirty flag', () => {
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).toBe(mcp.dirty);
        });
    });

    describe('resetDirtyState()', () => {
        it('Clears all added and removed elements', () => {
            mcp.added.add(testModels[0]);
            mcp.removed.add({ id: 'bah ' });
            expect(mcp.added.size).toBe(1);
            expect(mcp.removed.size).toBe(1);

            mcp.resetDirtyState();
            expect(mcp.added.size).toBe(0);
            expect(mcp.removed.size).toBe(0);
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            mcp.removed.add({ id: 'bah ' });
            expect(mcp.updateDirty()).toBe(true);
            mcp.resetDirtyState();
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('isDirty()', () => {
        it('Returns the current value of the dirty flag', () => {
            expect(mcp.isDirty()).toBe(mcp.dirty);
            mcp.add(testModels[0]);
            expect(mcp.isDirty()).toBe(true);
            expect(mcp.isDirty()).toBe(mcp.dirty);
        });

        it('Does not update the dirty flag', () => {
            expect(mcp.isDirty()).toBe(false);
            mcp.added.add(testModels[0]);
            expect(mcp.isDirty()).toBe(false);
        });
    });

    describe('save()', () => {
        const api = {
            get: jest.fn().mockReturnValue(Promise.resolve()),
            post: jest.fn().mockReturnValue(Promise.resolve()),
        };

        beforeEach(() => {
            mcp = new ModelCollectionProperty(mockParentModel, mockModelDefinition, [testModels[0]], api);
        });

        afterEach(() => {
            api.get.mockClear();
            api.post.mockClear();
        });

        it('Does nothing when the collection not dirty', (done) => {
            mcp.save()
                .then(() => {
                    expect(api.post).toHaveBeenCalledTimes(0);
                    done();
                }).catch(e => done(e));
        });

        it('Sends additions and removals in a single request', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    expect(api.post).toHaveBeenCalledTimes(1);
                    done();
                }).catch(e => done(e));
        });

        it('Uses the correct URL for requests', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    expect(api.post).toHaveBeenCalledTimes(1);
                    expect(api.post).toBeCalledWith('my.dhis/instance/dataElements', { additions: [{ id: 'dataEleme02' }], deletions: [{ id: 'dataEleme01' }] });
                    done();
                }).catch(e => done(e));
        });

        it('Sends the correct additions and removals', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.post).toBeCalledWith('my.dhis/instance/dataElements', {
                        additions: [{ id: testModels[1].id }],
                        deletions: [{ id: testModels[0].id }],
                    });
                    done();
                }).catch(e => done(e));
        });

        it('Resets the dirty flag', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            mcp.save()
                .then(() => {
                    expect(mcp.dirty).toBe(false);
                    done();
                }).catch(e => done(e));
        });

        it('Does not throw when the API fails', (done) => {
            api.post.mockReturnValue(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            expect(() => {
                mcp.save().then(() => done()).catch(() => done());
            }).not.toThrowError();
        });

        it('Rejects the promise when the API fails', (done) => {
            api.post.mockReturnValue(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            expect(() => {
                mcp.save().then(() => done('API failure was accepted silently')).catch(() => done());
            }).not.toThrowError();
        });
    });
});
