import Api from '../api/Api'
import AnalyticsRequest from './AnalyticsRequest'

/**
 * @private
 * @description
 * Base class for communicating with the analytics API endpoint.
 * Its subclasses can be used to get analytics data.
 *
 * @param {Instance} [api=<Api>] Api instance to use for the requests
 *
 * @requires module:api/Api
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsBase {
    constructor(api = Api.getApi()) {
        this.api = api
    }

    /**
     * Loads the analytics data and returns them as an object from the promise.
     * Two parallel requests are made against the analytics api.
     * One for getting only the metaData and one for getting the actual data.
     * This is for caching purposes, as in many situations the metaData request changes while
     * the data one will be the same and thus have the same response.
     * This methods takes care of adding the default extra parameters to both requests.
     *
     * @param {!AnalyticsRequest} req Analytics request object with the request details
     *
     * @returns {Promise} Promise that resolves with the analytics data and metaData from the api.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd']);
     *
     * d2.analytics.aggregate
     *  .get(req)
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     *
     * // { metaData: { ... }, rows: [ ... ], headers: [ ... ], height: 0, width: 0 }
     */
    get(req) {
        // keep metaData and data requests separate for caching purposes
        const metaDataReq = new AnalyticsRequest(req)
            .withSkipMeta(false)
            .withSkipData(true)
            .withIncludeMetadataDetails(true)

        const dataReq = new AnalyticsRequest(req)
            .withSkipData(false)
            .withSkipMeta(true);

        // parallelize requests
        return Promise.all([
            this.fetch(dataReq, { sorted: true }),
            this.fetch(metaDataReq),
        ]).then(responses =>
            Promise.resolve({
                ...responses[0],
                metaData: responses[1].metaData,
            })
        )
    }

    /**
     * @private
     * @description
     * This method does not manipulate the request object, but directly requests the data from the api
     * based on the request's configuration.
     *
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} options Optional configurations, ie. for sorting dimensions
     *
     * @returns {Promise} Promise that resolves with the data from the api.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .fromModel(chartModel)
     *  .withSkipData();
     *
     * d2.analytics.aggregate
     *  .fetch(req)
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     *
     * // { metaData: { ... }, rows: [], height: 0, width: 0 }
     */
    fetch(req, options) {
        return this.api
            .get(req.buildUrl(options), req.buildQuery(options))
            .then(data => Promise.resolve(data))
    }
}

export default AnalyticsBase
