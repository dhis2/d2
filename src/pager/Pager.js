class Pager {
    constructor(pager = {page: 1, pageCount: 1}) {
        this.page = pager.page;
        this.pageCount = pager.pageCount;
        this.total = pager.total;

        this.nextPage = pager.nextPage;
        this.prevPage = pager.prevPage;
    }
}

export default Pager;
