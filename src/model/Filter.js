import {checkDefined} from '../lib/check';

const FILTER_COMPARATORS = {
    /**
     * @method equals
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a equals filter value
     */
    equals: 'eq',
    /**
     * @method like
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a like filter value
     */
    like: 'like',
    /**
     * @method ilike
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a ilike filter value
     */
    ilike: 'ilike',
    notEqual: 'ne',
};

/**
 * @class Filter
 * @description
 * Filter class that can be used to build api endpoint filters using a semi-natural language style.
 */
class Filter {
    /**
     * @constructor
     * @param {Filters} filters Filters list that this filter will be added to when it is completed.
     */
    constructor(filters) {
        this.filters = filters;
        this.propertyName = 'name';
        this.comparator = 'like';
        this.filterValue = undefined;
    }

    /**
     * @method on
     * @param {String} propertyName Property name that the filter should be applied on.
     * @returns {Filter}
     */
    on(propertyName) {
        checkDefined(propertyName, 'Property name to filter on');

        this.propertyName = propertyName;
        return this;
    }

    getQueryParamFormat() {
        return [this.propertyName, this.comparator, this.filterValue].join(':');
    }

    /**
     * @method getFilter
     * @static
     *
     * @param {Filters} filters Filters list that this filter will be added to when it is completed.
     *
     * @returns A instance of the Filter class that can be used to create
     * filters.
     *
     * @description
     * Create a filter instance
     */
    static getFilter(filters) {
        return new Filter(filters);
    }
}

// Add the filters to the Filter prototype
// TODO: Change to for..of. Currently would break e2e tests because of polyfill
Object.keys(FILTER_COMPARATORS).forEach(filter => {
    Object.defineProperty(Filter.prototype, filter, {
        value: function filterGetter(filterValue) {
            checkDefined(filterValue, 'filterValue');

            this.comparator = FILTER_COMPARATORS[filter];
            this.filterValue = filterValue;

            this.filters.add(this);

            return this.filters.getReturn();
        },
    });
});

export default Filter;
