import { checkDefined } from '../lib/check';

/**
 * Transforms the given filter value to a api compatible list string.
 *
 * There are cases where the value is an array (e.g. the `in` operator),
 * in that case the value needs to be send as an array like syntax. (e.g. id:in:[pHqPnELfXHB,DriPR3izKbg])
 *
 * @param {Array} filterValue The value that was passed when the filter was called.
 * @returns {string}
 */
function toApiListSyntax(filterValue) {
    return `[${filterValue.join(',')}]`;
}

const FILTER_COMPARATORS = {
    /**
     * @method equals
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a equals filter value
     */
    equals: {
        operator: 'eq',
        inverseOperator: 'ne',
    },
    /**
     * @method like
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a like filter value
     */
    like: {
        operator: 'like',
    },
    contains: {
        operator: 'ilike',
    },
    /**
     * @method ilike
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * This method can be used to add a ilike filter value
     */
    ilike: {
        operator: 'ilike',
    },
    /**
     * @method startsWith
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the ^ilike operator to the filter
     */
    startsWith: {
        operator: '^ilike',
    },
    /**
     * @method endsWith
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the $ilike operator to the filter
     */
    endsWith: {
        operator: '$ilike',
    },
    /**
     * @method greaterThan
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the gt operator to the filter
     */
    greaterThan: {
        operator: 'gt',
        inverseOperator: 'le',
    },
    /**
     * @method greaterThanEqual
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the ge operator to the filter
     */
    greaterThanEqual: {
        operator: 'ge',
        inverseOperator: 'lt',
    },
    /**
     * @method lessThan
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the lt operator to the filter
     */
    lessThan: {
        operator: 'lt',
        inverseOperator: 'ge',
    },
    /**
     * @method lessThanEqual
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the le operator to the filter
     */
    lessThanEqual: {
        operator: 'le',
        inverseOperator: 'gt',
    },

    /**
     * @method isNull
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the null operator to the filter
     */
    isNull: {
        operator: 'null',
    },

    /**
     * @method in
     * @returns {Filter} Returns the modified filter for chaining
     *
     * @description
     * Apply the in operator to the filter
     */
    in: {
        operator: 'in',
        valueSerializer: toApiListSyntax,
    },
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
        this.comparator = FILTER_COMPARATORS.like;
        this.filterValue = undefined;
        this.negated = false;
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

    getComparator() {
        if (this.negated) {
            return this.comparator.inverseOperator || `!${this.comparator.operator}`;
        }

        return this.comparator.operator;
    }

    getQueryParamFormat() {
        const filterValue = this.comparator.valueSerializer ?
            this.comparator.valueSerializer(this.filterValue) :
            this.filterValue;

        return [this.propertyName, this.getComparator(), filterValue].join(':');
    }

    get not() {
        this.negated = true;
        return this;
    }

    /**
     * @method getFilter
     * @static
     *
     * @param {Filters} filters Filters list that this filter will be added to when it is completed.
     *
     * @returns {Filter} A instance of the Filter class that can be used to create
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
Object.keys(FILTER_COMPARATORS).forEach((filter) => {
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
