import AnalyticsBase from './AnalyticsBase';

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @param {!String} program Program id
 * @param {Object} props Additional properties to pass to the constructor for overriding
 *
 * @description
 * Analytics events class used to request analytics events data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/master/en/developer/html/webapi_event_analytics.html
 */
class AnalyticsEvents extends AnalyticsBase {
    constructor(program, ...props) {
        super(...props);

        this.program = program;

        this.endPoint += '/events';
    }

    /**
     * @param {!String} program Program id
     * The program id is requires for making the other requests.
     *
     * @returns {this} Itself for chaining purposes
     *
     * @example
     * d2.analytics.events.setProgram('eBAyeGv0exc');
     */
    setProgram(program) {
        this.program = program;

        return this;
    }

    /**
     * @param {Object} params Object with parameters to pass in the request
     *
     * @returns {Promise} Promise that resolves with the analytics aggregate data from the api.
     *
     * @example
     * const d2AnalyticsEvents = d2.analytics.events
     *  .setProgram('eBAyeGv0exc')
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *    ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsEvents.getAggregate({
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getAggregate(params) {
        // TODO validate?
        // there is a fixed list of possible optional parameters
        // also, before firing the request, check if the minimum dimensions are provided?
        if (params) {
            this.addParameters(params);
        }

        return this.get(`aggregate/${this.program}`);
    }

    /**
     * @param {Object} params Object with parameters to pass to the request
     *
     * @returns {Promise} Promise that resolves with the analytics count data from the api.
     *
     * @example
     * const d2AnalyticsEvents = d2.analytics.events
     *  .setProgram('eBAyeGv0exc')
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *    ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsEvents.getCount({
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getCount(params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get(`count/${this.program}`);
    }

    /**
     * @param {!Object} params Object with parameters to pass to the request
     * Must contain clusterSize and bbox parameters.
     *
     * @returns {Promise} Promise that resolves with the analytics cluster data from the api.
     *
     * @example
     * const d2AnalyticsEvents = d2.analytics.events
     *  .setProgram('eBAyeGv0exc')
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *    ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsEvents.getCluster({
     *   clusterSize: 100000,
     *   bbox: '-13.2682125,7.3721619,-10.4261178,9.904012',
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getCluster(params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get(`cluster/${this.program}`);
    }

    /**
     * @oaram {Object} params Object with parameters to pass to the request
     *
     * @returns {Promise} Promise that resolves with the analytics query data from the api.
     *
     * @example
     * const d2AnalyticsEvents = d2.analytics.events
     *  .setProgram('eBAyeGv0exc')
     *  .addDimensions([
     *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
     *   'pe:LAST_4_QUARTERS',
     *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
     *    ...
     *  ])
     *  .addFilters([
     *   'ou:O6uvpzGd5pu'
     *   ...
     *  ]);
     *
     *  d2AnalyticsEvents.getQuery({
     *   startDate: '2017-10-01',
     *   endDate: '2017-10-31',
     *   ...
     *  })
     *  .then(console.log);
     */
    getQuery(params) {
        if (params) {
            this.addParameters(params);
        }

        return this.get(`query/${this.program}`);
    }
}

export default AnalyticsEvents;
