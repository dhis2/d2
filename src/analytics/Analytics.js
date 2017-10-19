/**
 * @module analytics
 */
import AnalyticsAggregate from './AnalyticsAggregate';
import AnalyticsEvents from './AnalyticsEvents';

/**
 * @description
 * Analytics class used to request analytics data from Web API.
 *
 * @requires analytics.AnalyticsAggregate
 * @requires analytics.AnalyticsEvents
 *
 * @example
 * const d2Analytics = new Analytics(
 *  new AnalyticsAggregate(),
 *  new AnalyticsEvents()
 * )
 *
 * @memberof module:analytics
 */
class Analytics {
    /**
     * @param {!module:analytics.AnalyticsAggregate} analyticsAggregate The AnalyticsAggregate instance
     * @param {!module:analytics.AnalyticsEvents} analyticsEvents The AnalyticsEvents instance
     */
    constructor(analyticsAggregate, analyticsEvents) {
        this.aggregate = analyticsAggregate;
        this.events = analyticsEvents;
    }

    /**
     * @static
     *
     * @description
     * Get a new instance of the Analytics object. This will function as a singleton, when Analytics object
     * has been created when requesting getAnalytics again the original version will be returned.
     *
     * @returns {Analytics} Object with the analytics interaction properties
     *
     * @example
     * const d2Analytics = d2.getAnalytics();
     */
    static getAnalytics() {
        if (!Analytics.getAnalytics.analytics) {
            Analytics.getAnalytics.analytics = new Analytics(
                new AnalyticsAggregate(),
                new AnalyticsEvents(),
            );
        }

        return Analytics.getAnalytics.analytics;
    }
}

export default Analytics;
