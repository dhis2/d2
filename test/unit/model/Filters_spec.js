'use strict';

import Filters from '../../../src/model/Filters';
import Filter from '../../../src/model/Filter';

describe('Filters', () => {

    describe('getFilters', () => {
        it('should be a function', () => {
            expect(Filters.getFilters).to.be.instanceof(Function);
        });

        it('should return an instance of Filters', () => {
            let filters = new Filters();

            expect(filters).to.be.instanceof(Filters);
        });
    });

    describe('on', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should return an instance of the Filter', () => {
            expect(filters.on('code')).to.be.instanceof(Filter);
        });

        it('should have preset the filter with the passed property', () => {
            let filter = filters.on('code');

            expect(filter.propertyName).to.equal('code');
        });
    });

    describe('add', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should add a filter instance to the list of filters', () => {
            let filter = new Filter(filters);

            filters.add(filter);

            expect(filters.filters.length).to.equal(1);
            expect(filters.filters[0]).to.equal(filter);
        });

        it('should not add the filter if it is not an instance of Filter', () => {
            let filter = { value: 'someValue', comparator: 'like' };

            expect(() => filters.add(filter)).to.throw('filter should be an instance of Filter');
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
                    this.list = sinon.stub().returns(resolvedPromise);
                }
            }

            modelDefinition = new ModelDefinition();
            filters = new Filters(modelDefinition);
        });

        it('should call the list method on the modelDefinition', () => {
            filters.list();

            expect(modelDefinition.list).to.be.called;
        });

        it('should return the promise from the list method', () => {
            let result = filters.list();

            expect(result).to.equal(resolvedPromise);
        });
    });

    describe('getFilters', () => {
        let filters;

        beforeEach(() => {
            filters = new Filters();
        });

        it('should be a function', () => {
            expect(filters.getFilters).to.be.instanceof(Function);
        });

        it('should return an empty array when no filters are set', () => {
            expect(filters.getFilters()).to.deep.equal([]);
        });

        it('should return the set filters', () => {
            filters.on('code').equals('Partner_453');
            filters.on('name').like('John');

            expect(filters.getFilters()).to.deep.equal(['code:eq:Partner_453', 'name:like:John']);
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
            expect(filters.getReturn).to.be.instanceof(Function);
        });

        it('should return the modelDefinition', () => {
            expect(filters.getReturn()).to.equal(modelDefinitionFake);
        });
    });
});
