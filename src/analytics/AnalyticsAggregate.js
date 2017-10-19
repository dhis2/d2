import AnalyticsBase from './AnalyticsBase';

/**
 * @extends AnalyticsBase
 *
 * @param {Object} props Properties to pass to the constructor for overriding
 *
 * @description
 * Analytics aggregate class used to request aggregate analytics data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/master/en/developer/html/webapi_analytics.html
 */
class AnalyticsAggregate extends AnalyticsBase {
    /**
     * @param {String} [format=json] Format for the output.
     * Supported formats are JSON and XML.
     * @param {Object} params Object with parameters to pass to the request
     *
     * @returns {Promise} Promise that resolves with the analytics data value set data from the API.
     *
     * @example
     * const d2AnalyticsAggregate = d2.analytics.aggregate
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *   ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     * d2AnalyticsAggregate.getDataValueSet('json', {
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     * })
     * .then(console.log);
     */
    getDataValueSet(format = 'json', params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get(`dataValueSet.${format}`);
    }

    /**
     * @param {String} [format=json] Format for the output.
     * Supported formats are JSON and XML.
     * @param {Object} params Object with parameters to pass to the request
     *
     * @returns {Promise} Promise that resolves with the raw data from the API.
     *
     * @example
     * const d2AnalyticsAggregate = d2.analytics.aggregate
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *   ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsAggregate.getRawData('xml', {
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getRawData(format = 'json', params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get(`rawData.${format}`);
    }

    /**
     * @param {Object} params Object with parameters to pass to the request
     *
     * @returns {Promise} Promise that resolves with the SQL statement used to query the database.
     *
     * @example
     * const d2AnalyticsAggregate = d2.analytics.aggregate
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *   ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsAggregate.getDebugSql({
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getDebugSql(params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get('debug/sql');
    }
}

export default AnalyticsAggregate;
