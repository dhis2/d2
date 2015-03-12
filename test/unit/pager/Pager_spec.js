import Pager from 'd2/pager/Pager';

describe('Pager', () => {
    let pagerFixtureOne;
    let pageFixtureTwo;

    describe('instance without data', () => {
        let pager;

        beforeEach(() => pager = new Pager());

        it('should set the page to first', () => {
            expect(pager.page).to.equal(1);
        });

        it('should set the total page count to 1', () => {
            expect(pager.pageCount).to.equal(1);
        });

        it('should set the total item count to undefined', () => {
            expect(pager.total).to.not.be.defined;
        });

        it('should not set the nextPage', () => {
            expect(pager.nextPage).to.not.be.defined;
        });

        it('should not set the prevPage', () => {
            expect(pager.prevPage).to.not.be.defined;
        });
    });

    describe('instance with data', () => {
        let pager;

        beforeEach(() => {
            pagerFixtureOne = {
                page: 1,
                pageCount: 37,
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2'
            };
            pageFixtureTwo = {
                page: 3,
                pageCount: 37,
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=4',
                prevPage: 'http://localhost:8080/dhis/api/dataElements?page=2'
            };

            pager = new Pager(pagerFixtureOne);
        });

        it('should be an instance of Pager', () => {
            expect(pager).to.be.instanceof(Pager);
        });

        it('should have a total item count', () => {
            expect(pager.total).to.equal(1844);
        });

        it('should have the current page number', () => {
            expect(pager.page).to.equal(1);
        });

        it('should have a pageCount', () => {
            expect(pager.pageCount).to.equal(37);
        });

        it('should have a nextPage url', () => {
            expect(pager.nextPage).to.equal('http://localhost:8080/dhis/api/dataElements?page=2');
        });

        it('should have previous page', () => {
            pager = new Pager(pageFixtureTwo);

            expect(pager.prevPage).to.equal('http://localhost:8080/dhis/api/dataElements?page=2');
        });
    });
});
