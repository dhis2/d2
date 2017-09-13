

import Filters from '../../../src/model/Filters';
import Filter from '../../../src/model/Filter';

describe('Filters', () => {
    describe('getFilters', () => {
        it('should be a function', () => {
            expect(Filters.getFilters).toBeInstanceOf(Function);
        });

        it('should return an instance of Filters', () => {
            const filters = new Filters();

            expect(filters).toBeInstanceOf(Filters);
        });
    });

    describe('on', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should return an instance of the Filter', () => {
            expect(filters.on('code')).toBeInstanceOf(Filter);
        });

        it('should have preset the filter with the passed property', () => {
            const filter = filters.on('code');

            expect(filter.propertyName).toBe('code');
        });
    });

    describe('add', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should add a filter instance to the list of filters', () => {
            const filter = new Filter(filters);

            filters.add(filter);

            expect(filters.filters.length).toBe(1);
            expect(filters.filters[0]).toBe(filter);
        });

        it('should not add the filter if it is not an instance of Filter', () => {
            const filter = { value: 'someValue', comparator: 'like' };

            expect(() => filters.add(filter)).toThrowError('filter should be an instance of Filter');
        });
    });

    describe('list', () => {
        let resolvedPromise;
        let modelDefinition;
        let filters;

        beforeEach(() => {
            resolvedPromise = Promise.resolve([]);

            class ModelDefinition {
                constructor() {
                    this.list = jest.fn().mockReturnValue(resolvedPromise);
                }
            }

            modelDefinition = new ModelDefinition();
            filters = new Filters(modelDefinition);
        });

        it('should call the list method on the modelDefinition', () => {
            filters.list();

            expect(modelDefinition.list).toBeCalled();
        });

        it('should return the promise from the list method', () => {
            const result = filters.list();

            expect(result).toBe(resolvedPromise);
        });
    });

    describe('getFilters', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should be a function', () => {
            expect(filters.getFilters).toBeInstanceOf(Function);
        });

        it('should return an empty array when no filters are set', () => {
            expect(filters.getFilters()).toEqual([]);
        });

        it('should return the set filters', () => {
            filters.on('code').equals('Partner_453');
            filters.on('name').like('John');

            expect(filters.getFilters()).toEqual(['code:eq:Partner_453', 'name:like:John']);
        });
    });

    describe('getReturn', () => {
        let modelDefinitionFake;
        let filters;

        beforeEach(() => {
            modelDefinitionFake = {};
            filters = new Filters(modelDefinitionFake);
        });

        it('should be a function', () => {
            expect(filters.getReturn).toBeInstanceOf(Function);
        });

        it('should return the modelDefinition', () => {
            expect(filters.getReturn()).toBe(modelDefinitionFake);
        });
    });
});
