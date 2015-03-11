class Pager {
    constructor(pager) {
        this.page = pager.page;
        this.pageCount = pager.pageCount;
        this.total = pager.total;

        this.nextPage = pager.nextPage;
        this.prevPage = pager.prevPage;
    }
}

export default Pager;
