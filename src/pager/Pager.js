import {isDefined} from 'd2/lib/check';

/**
 * @class Pager
 *
 * @description
 * Pager object that can be used to navigate pages within a `Modelcollection`
 */
class Pager {

    /**
     * @constructor
     *
     * @param {Object} [pager={page: 1, pageCount: 1}] Paging information object.
     * @param {Object} [pagingHandler={list: () => Promise.reject('No handler available')}] Paging handler object. The requirement for this object is that it has a list method.
     *
     * @description
     * Returns a newly created pager object with methods to navigate pages.
     */
    constructor(pager = {page: 1, pageCount: 1}, pagingHandler = {list: () => Promise.reject('No handler available')}) {
        /**
         * @property {number} page Current page number
         */
        this.page = pager.page;

        /**
         * @property {number} pageCount The total number of pages available
         */
        this.pageCount = pager.pageCount;

        /**
         * @property {number} total The total number of items available.
         *
         * @description
         * This represents the total number of items available in the system. Note it is not the number of items
         * on the current page.
         */
        this.total = pager.total;

        /**
         * @property {string} nextPage The url to the next page.
         *
         * @description
         * If there is no next page then this will be undefined.
         */
        this.nextPage = pager.nextPage;

        /**
         * @property {string} prevPage The url to the previous page
         *
         * @description
         * If there is no previous page then this will be undefined.
         */
        this.prevPage = pager.prevPage;

        this.pagingHandler = pagingHandler;
    }

    /**
     * @method hasNextPage
     *
     * @returns {Boolean} Result is true when there is a next page, false when there is not.
     *
     * @description
     * Check whether there is a next page.
     */
    hasNextPage() {
        return isDefined(this.nextPage);
    }

    /**
     * @method hasPreviousPage
     *
     * @returns {Boolean} Result is true when there is a previous page, false when there is not.
     *
     * @description
     * Check whether there is a previous page.
     */
    hasPreviousPage() {
        return isDefined(this.prevPage);
    }

    /**
     * @method getNextPage
     *
     * @returns {Promise} Promise that resolves with a new `ModelCollection` containing the next page's data. Or rejects with
     * a string when there is no next page for this collection or when the request for the next page failed.
     */
    getNextPage() {
        if (this.hasNextPage()) {
            return this.goToPage(this.page + 1);
        }
        return Promise.reject('There is no next page for this collection');
    }

    /**
     * @method getPreviousPage
     *
     * @returns {Promise} Promise that resolves with a new `ModelCollection` containing the previous page's data. Or rejects with
     * a string when there is no previous page for this collection or when the request for the previous page failed.
     */
    getPreviousPage() {
        if (this.hasPreviousPage()) {
            return this.goToPage(this.page - 1);
        }
        return Promise.reject('There is no previous page for this collection');
    }

    /**
     * @method goToPage
     *
     * @param {Number} pageNr The number of the page you wish to navigate to.
     * @returns {Promise} Promise that resolves with a new `ModelCollection` containing the data for the requested page.
     */
    // TODO: Throwing the errors here is not really consistent with the rejection of promises for the getNextPage and getPreviousPage
    goToPage(pageNr) {
        if (pageNr < 1) {
            throw new Error('PageNr can not be less than 1');
        }
        if (pageNr > this.pageCount) {
            throw new Error('PageNr can not be larger than the total page count of ' + this.pageCount);
        }

        return this.pagingHandler.list({page: pageNr});
    }
}

export default Pager;
