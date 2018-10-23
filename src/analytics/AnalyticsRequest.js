import AnalyticsRequestDimensionsMixin from './AnalyticsRequestDimensionsMixin';
import AnalyticsRequestFiltersMixin from './AnalyticsRequestFiltersMixin';
import AnalyticsRequestPropertiesMixin from './AnalyticsRequestPropertiesMixin';
import AnalyticsRequestBase from './AnalyticsRequestBase';

/**
 * @description
 * Class for constructing a request object to use for communicating with the analytics API endpoint.
 *
 * @param {!Object} options Object with analytics request options
 *
 * @memberof module:analytics
 *
 * @extends module:analytics.AnalyticsRequestDimensionsMixin
 * @extends module:analytics.AnalyticsRequestFiltersMixin
 * @extends module:analytics.AnalyticsRequestPropertiesMixin
 * @extends module:analytics.AnalyticsRequestBase
 */
class AnalyticsRequest extends AnalyticsRequestDimensionsMixin(
    AnalyticsRequestFiltersMixin(AnalyticsRequestPropertiesMixin(AnalyticsRequestBase)),
) {
    /**
     * Extracts dimensions and filters from an analytic object model and add them to the request
     *
     * @param {Object} model The analytics object model from which extract the dimensions/filters
     * @param {Boolean} [passFilterAsDimension=false] Pass filters as dimension in the query string (used in dataValueSet requests)
     *
     * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
     *
     * @example
     * const req = new d2.analytics.request()
     *    .fromModel(model);
     *
     * // dimension=pe:LAST_12_MONTH&dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU;Jtf34kNZhzP;hfdmMSPBgLG&filter=ou:ImspTQPwCqd
     *
     * const req2 = new d2.analytics.request()
     *    .fromModel(model, true);
     *
     * // dimension=pe:LAST_12_MONTH&dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU;Jtf34kNZhzP;hfdmMSPBgLG&dimension=ou:ImspTQPwCqd
     */
    fromModel(model, passFilterAsDimension = false) {
        let request = this;

        // extract dimensions from model
        const columns = model.columns || [];
        const rows = model.rows || [];

        columns.concat(rows).forEach((d) => {
            let dimension = d.dimension;

            if (d.filter) {
                dimension += `:${d.filter}`;
            }

            request = request.addDimension(dimension, d.items.map(item => item.id));
        });

        // extract filters from model
        const filters = model.filters || [];

        filters.forEach((f) => {
            request = passFilterAsDimension
                ? request.addDimension(f.dimension, f.items.map(item => item.id))
                : request.addFilter(f.dimension, f.items.map(item => item.id));
        });

        return request;
    }
}

export default AnalyticsRequest;
