import { cloneDeep } from 'lodash';
import { customEncodeURIComponent } from '../lib/utils';

/**
 * @private
 * @description
 * Class for constructing a request object to use for communicating with the analytics API endpoint.
 *
 * @param {!Object} options Object with analytics request options
 *
 * @requires module:lib/utils
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsRequestBase {
    constructor({
        endPoint = 'analytics',
        format = 'json',
        path,
        program,
        dimensions = [],
        filters = [],
        parameters = {},
    } = {}) {
        this.endPoint = endPoint;
        this.format = format.toLowerCase();
        this.path = path;
        this.program = program;

        this.dimensions = dimensions;
        this.filters = filters;
        this.parameters = { ...parameters };
    }

    /**
     * @private
     * @description
     * Builds the URL to pass to the Api object.
     * The URL includes the dimension(s) parameters.
     * Used internally.
     *
     * @param {Object} options Optional configurations
     *
     * @returns {String} URL URL for the request with dimensions included
     */
    buildUrl(options) {
        // at least 1 dimension is required
        let dimensions = this.dimensions;

        if (options && options.sorted) {
            dimensions = cloneDeep(dimensions);

            dimensions.sort((a, b) => (a.dimension > b.dimension));
        }

        const encodedDimensions = dimensions.map(({ dimension, items }) => {
            if (Array.isArray(items) && items.length) {
                if (options && options.sorted) {
                    items.sort();
                }

                return `${dimension}:${items.map(customEncodeURIComponent).join(';')}`;
            }

            return dimension;
        });

        const endPoint = [this.endPoint, this.path, this.program].filter(e => !!e).join('/');

        return (
            `${endPoint}.${this.format}?dimension=${encodedDimensions.join('&dimension=')}`
        );
    }

    /**
     * @private
     * @description
     * Builds the query object passed to the API instance.
     * The object includes all the parameters added via with*() methods
     * and the filters added via addDataFilter(), addPeriodFilter(), addOrgUnitFilter(), addFilter().
     * The filters are handled by the API instance when building the final URL.
     * Used internally.
     *
     * @param {Object} options Optional configurations
     *
     * @returns {Object} Query parameters
     */
    buildQuery(options) {
        let filters = this.filters;

        if (options && options.sorted) {
            filters = cloneDeep(filters);

            filters.sort((a, b) => (a.dimension > b.dimension));
        }

        const encodedFilters = filters.map(({ dimension, items }) => {
            if (Array.isArray(items) && items.length) {
                if (options && options.sorted) {
                    items.sort();
                }

                return `${dimension}:${items.map(customEncodeURIComponent).join(';')}`;
            }

            return dimension;
        });

        if (filters.length) {
            this.parameters.filter = encodedFilters;
        }

        return this.parameters;
    }
}

export default AnalyticsRequestBase;
