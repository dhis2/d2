import {isDefined} from 'd2/lib/check';

class Pager {
    constructor(pager = {page: 1, pageCount: 1}, pagingHandler = {list: () => Promise.reject('No handler available')}) {
        this.page = pager.page;
        this.pageCount = pager.pageCount;
        this.total = pager.total;

        this.nextPage = pager.nextPage;
        this.prevPage = pager.prevPage;

        this.pagingHandler = pagingHandler;
    }

    hasNextPage() {
        return isDefined(this.nextPage);
    }

    hasPreviousPage() {
        return isDefined(this.prevPage);
    }

    getNextPage() {
        if (this.hasNextPage()) {
            return this.pagingHandler.list({page: this.page + 1});
        }
        return Promise.reject('There is no next page for this collection');
    }

    getPreviousPage() {
        if (this.hasPreviousPage()) {
            return this.pagingHandler.list({page: this.page - 1});
        }
        return Promise.reject('There is no previous page for this collection');
    }
}

export default Pager;
