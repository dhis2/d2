import Filters from '../Filters';
import Filter from '../Filter';

describe('Filter', () => {
    describe('getFilter', () => {
        it('should create an instance of filter', () => {
            expect(Filter.getFilter()).toBeInstanceOf(Filter);
        });
    });

    describe('instance', () => {
        let filters;
        let filter;

        beforeEach(() => {
            filters = new Filters();
            filter = new Filter(filters);
        });

        it('should have a comparator', () => {
            expect(filter.comparator).toBeDefined();
        });

        it('the comparator should default to like', () => {
            expect(filter.comparator.operator).toBe('like');
        });

        it('should set the default properyName to name', () => {
            expect(filter.propertyName).toBe('name');
        });

        describe('comparators', () => {
            it('should have an like  method', () => {
                expect(filter.like).toBeInstanceOf(Function);
            });

            it('should have an ilike method', () => {
                expect(filter.ilike).toBeInstanceOf(Function);
            });

            it('should have an equals method', () => {
                expect(filter.equals).toBeInstanceOf(Function);
            });

            it('should set the eq comparator', () => {
                filter.equals('ANC');

                expect(filter.comparator.operator).toBe('eq');
            });

            it('should set the passed filterValue onto the filter', () => {
                filter.equals('ANC');

                expect(filter.filterValue).toBe('ANC');
            });

            it('should throw an error when no filterValue is provided', () => {
                expect(() => filter.equals()).toThrowError('filterValue should be provided');
            });

            it('should return call the getReturn method on filters', () => {
                const modelDefinitionFake = {};
                filters.getReturn = jest.fn().mockReturnValue(modelDefinitionFake);

                filter.equals('ANC');

                expect(filters.getReturn).toBeCalled();
                expect(filter.equals('ANC')).toBe(modelDefinitionFake);
            });

            it('should call add on the Filters instance with itself as parameter', () => {
                filters.add = jest.fn();

                filter.on('year').equals('2013');

                expect(filters.add).toBeCalledWith(filter);
            });

            it('should set the like comparator', () => {
                filter.like('ANC');

                expect(filter.comparator.operator).toBe('like');
            });

            it('should set the ilike comparator', () => {
                filter.ilike('ANC');

                expect(filter.comparator.operator).toBe('ilike');
            });

            it('should set the ^ilike comparator for startsWith', () => {
                filter.startsWith('ANC');

                expect(filter.comparator.operator).toBe('^ilike');
            });

            it('should set the $ilike comparator for notStartsWith', () => {
                filter.endsWith('ANC');

                expect(filter.comparator.operator).toBe('$ilike');
            });

            it('should set the null comparator for isNull', () => {
                filter.isNull('ANC');

                expect(filter.comparator.operator).toBe('null');
            });

            it('should set the in for the "in" operator', () => {
                filter.in(['pHqPnELfXHB', 'DriPR3izKbg']);

                expect(filter.comparator.operator).toBe('in');
            });
        });

        describe('on', () => {
            it('should be a function', () => {
                expect(filter.on).toBeInstanceOf(Function);
            });

            it('should return itself for chaining', () => {
                expect(filter.on('name')).toBe(filter);
            });

            it('should throw an error when the propertyName is undefined', () => {
                expect(() => filter.on()).toThrowError('Property name to filter on should be provided');
            });

            it('should set the propertyName onto the filter', () => {
                filter.on('year');

                expect(filter.propertyName).toBe('year');
            });
        });

        describe('getQueryParamFormat', () => {
            beforeEach(() => {
                filter.on('code').equals('Partner_343');
            });

            it('should be a function', () => {
                expect(filter.getQueryParamFormat).toBeInstanceOf(Function);
            });

            it('should return the filter value in the expected query format', () => {
                expect(filter.getQueryParamFormat()).toBe('code:eq:Partner_343');
            });

            it('should return the correct query format for the "in" operator', () => {
                filter.on('id').in(['pHqPnELfXHB', 'DriPR3izKbg']);

                expect(filter.getQueryParamFormat()).toBe('id:in:[pHqPnELfXHB,DriPR3izKbg]');
            });
        });

        describe('negation', () => {
            it('should negate like with a !', () => {
                filter.on('name').not.like('ANC');

                expect(filter.getQueryParamFormat()).toBe('name:!like:ANC');
            });

            it('should negate startsWith with a !', () => {
                filter.on('name').not.startsWith('ANC');

                expect(filter.getQueryParamFormat()).toBe('name:!^ilike:ANC');
            });

            it('should negate the filter when `not` is called', () => {
                filter.on('name').not.equals('ANC');

                expect(filter.getQueryParamFormat()).toBe('name:ne:ANC');
            });

            it('should flip greaterThan to the lessThanEqual filter when `not`is called', () => {
                filter.on('name').not.greaterThan('ANC');

                expect(filter.getQueryParamFormat()).toBe('name:le:ANC');
            });

            it('should flip greaterThan to the lessThanEqual filter when `not`is called', () => {
                filter.on('name').not.greaterThan('ANC');

                expect(filter.getQueryParamFormat()).toBe('name:le:ANC');
            });

            it('should correctly negate the "in" operator', () => {
                filter.on('id').not.in(['pHqPnELfXHB', 'DriPR3izKbg']);

                expect(filter.getQueryParamFormat()).toBe('id:!in:[pHqPnELfXHB,DriPR3izKbg]');
            });
        });
    });
});
