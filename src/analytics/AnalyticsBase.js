import Api from '../api/Api';
import { customEncodeURIComponent } from '../lib/utils';

/**
 * @private
 * @description
 * Base class for communicating with the analytics API endpoint.
 * Its subclasses can be used to get analytics data.
 *
 * @param {Instance} [api=<Api>] Api instance to use for the requests
 * @param {String} [endPoint=analytics] Relative path to the analytics API endpoint
 *
 * @requires module:lib/utils
 * @requires module:api/Api
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsBase {
    constructor(api = Api.getApi(), endPoint = 'analytics') {
        this.api = api;
        this.endPoint = endPoint;
        this.query = {};
        this.dimensions = [];
        this.filters = [];
    }

    /**
     * Adds a new dimension to use in the request.
     *
     * @param {!String} dimension The dimension to add to the request
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.aggregate.addDimension('ou:ImspTQPwCqd');
     */
    addDimension(dimension) {
        return this.addDimensions([dimension]);
    }

    /**
     * Adds multiple dimensions to the request.
     *
     * @param {!Array} dimensions List of dimensions to add to the request
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.events.addDimensions([
     *  'ou:ImspTQPwCqd',
     *  'pe:THIS_YEAR',
     *  'msodh3rEMJa',
     *  ...
     * ]);
     */
    addDimensions(dimensions) {
        if (dimensions && Array.isArray(dimensions)) {
            this.dimensions.push(...dimensions);
        }

        return this;
    }

    /**
     * Adds a filter to the request.
     *
     * @param {!String} filter A filter to add to the request
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.aggregate.addFilter('ou:O6uvpzGd5pu');
     */
    addFilter(filter) {
        return this.addFilters([filter]);
    }

    /**
     * Adds mutiple filters to the request.
     *
     * @param {!Array} filters List of filters to add to the request
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.events.addFilters([
     *  'ou:O6uvpzGd5pu',
     *  'pe:2016Q1;2016Q2',
     * ]);
     */
    addFilters(filters) {
        if (filters && Array.isArray(filters)) {
            this.filters.push(...filters);
        }

        return this;
    }

    /**
     * Adds multiple parameters to add to the request.
     *
     * @param {!Object} parameters Additional parameters to add to the request
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.events.addParameters({
     *  measureCriteria: 'GE:6000'
     *  startDate: '2017-10-10',
     *  endDate: '2017-10-13'
     * });
     */
    addParameters(parameters) {
        if (parameters) {
            this.query = { ...this.query, ...parameters };
        }

        return this;
    }

    /**
     * @private
     *
     * Builds the URL to pass to the Api object.
     * The URL includes the dimension(s) parameters.
     * Used internally.
     *
     * @param {!String} path Path portion to append to the URL for the request
     *
     * @returns {String} URL
     */
    buildUrl(path) {
        const encodedDimensions = this.dimensions
            .map(dimension => dimension.split(':').map(customEncodeURIComponent).join(':'));

        const endPoint = (path) ? `${this.endPoint}/${path}` : this.endPoint;

        return (
            `${endPoint}?dimension=${encodedDimensions.join('&dimension=')}`
        );
    }

    /**
     * @private
     *
     * Builds the query object passed to the API instance.
     * The object includes all the parameters passed via addParameter / addParameters.
     * and the filters passed via addFilter / addFilters.
     * The filters are handled by the API instance when building the final URL.
     * Used internally.
     *
     * @returns {Object} Query parameters
     */
    buildQuery() {
        if (this.filters.length > 0) {
            this.query.filter = this.filters;
        }

        return this.query;
    }

    /**
     * Loads the analytics data and returns them as an object from the promise.
     *
     * @param {String} path The path to append to the endpoint value.
     *
     * @returns {Promise} Promise that resolves with the analytics data from the api.
     *
     * @example
     * d2.analytics.aggregate
     *  .addDimensions([
     *   'dx:Jtf34kNZhzP;fbfJHSPpUQD',
     *   'pe:LAST_12_MONTHS'
     *  ])
     *  .addFilter('ou:ImspTQPwCqd')
     *  .get()
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     */
    get(path) {
        // JSON responses
        this.api.setDefaultHeaders({
            accept: 'application/json',
        });

        return this.api.get(
            this.buildUrl(path),
            this.buildQuery())
            .then(data => Promise.resolve(data));
    }
}

export default AnalyticsBase;
