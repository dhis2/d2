import Filters from 'd2/model/Filters';
import Filter from 'd2/model/Filter';

describe('Filter', () => {
    describe('getFilter', () => {
        it('should create an instance of filter', () => {
            expect(Filter.getFilter()).to.be.instanceof(Filter);
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
            expect(filter.comparator).to.not.be.undefined;
        });

        it('the comparator should default to like', () => {
            expect(filter.comparator).to.equal('like');
        });

        it('should set the default properyName to name', () => {
            expect(filter.propertyName).to.equal('name');
        });

        describe('comparators', () => {
            it('should have an like  method', () => {
                expect(filter.like).to.be.instanceof(Function);
            });

            it('should have an ilike method', () => {
                expect(filter.ilike).to.be.instanceof(Function);
            });

            it('should have an equals method', () => {
                expect(filter.equals).to.be.instanceof(Function);
            });

            it('should set the correct comparator', () => {
                filter.equals('ANC');

                expect(filter.comparator).to.equal('eq');
            });

            it('should set the passed filterValue onto the filter', () => {
                filter.equals('ANC');

                expect(filter.filterValue).to.equal('ANC');
            });

            it('should throw an error when no filterValue is provided', () => {
                expect(() => filter.equals()).to.throw('filterValue should be provided');
            });

            it('should return call the getReturn method on filters', () => {
                let modelDefinitionFake = {};
                filters.getReturn = sinon.stub().returns(modelDefinitionFake);

                filter.equals('ANC');

                expect(filters.getReturn).to.be.called;
                expect(filter.equals('ANC')).to.equal(modelDefinitionFake);
            });

            it('should call add on the Filters instance with itself as parameter', () => {
                filters.add = sinon.spy();

                filter.on('year').equals('2013');

                expect(filters.add).to.be.calledWith(filter);
            });
        });

        describe('on', () => {
            it('should be a function', () => {
                expect(filter.on).to.be.instanceof(Function);
            });

            it('should return itself for chaining', () => {
                expect(filter.on('name')).to.equal(filter);
            });

            it('should throw an error when the propertyName is undefined', () => {
                expect(() => filter.on()).to.throw('Property name to filter on should be provided');
            });

            it('should set the propertyName onto the filter', () => {
                filter.on('year');

                expect(filter.propertyName).to.equal('year');
            });
        });

        describe('getQueryParamFormat', () => {
            beforeEach(() => {
                filter.on('code').equals('Partner_343');
            });

            it('should be a function', () => {
                expect(filter.getQueryParamFormat).to.be.instanceof(Function);
            });

            it('should return the filter value in the expected query format', () => {
                expect(filter.getQueryParamFormat()).to.equal('code:eq:Partner_343');
            });
        });
    });
});
