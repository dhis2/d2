describe('Pager', () => {
    let Pager;
    let pager;
    let pagerFixtureOne;
    let pageFixtureTwo;

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

        Pager = require('d2/pager/Pager');
        pager = new Pager(pagerFixtureOne);
    });

    describe('instance', () => {
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
