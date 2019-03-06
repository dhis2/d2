import AnalyticsRequest from './AnalyticsRequest'

/**
 * @private
 * @description
 * AnalyticsRequest filters mixin function
 *
 * @param {*} base The base class to mix onto
 * @return {module:analytics.AnalyticsRequestFiltersMixin} The mixin class
 * @mixin
 */
/**
 * @private
 * @description
 * AnalyticsRequest filters mixin class
 *
 * @alias module:analytics.AnalyticsRequestFiltersMixin
 */
const AnalyticsRequestFiltersMixin = base =>
    class extends base {
        /**
         * Adds/updates the dx dimension filter to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the dx dimension filter
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addDataFilter(['fbfJHSPpUQD', 'cYeuwXTCPkU'])
         *    .addDataFilter('BfMAe6Itzgt.REPORTING_RATE');
         *
         * // filter=dx:fbfJHSPpUQD;cYeuwXTCPkU;BfMAe6Itzgt.REPORTING_RATE
         */
        addDataFilter(items) {
            return this.addFilter('dx', items)
        }

        /**
         * Adds/updates the pe dimension filter to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the pe dimension filter
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addPeriodFilter(['201701', '201702'])
         *    .addPeriodFilter('LAST_4_QUARTERS')
         *
         * // filter=pe:201701;201702;LAST_4_QUARTERS
         */
        addPeriodFilter(items) {
            return this.addFilter('pe', items)
        }

        /**
         * Adds/updates the ou dimension filter to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the ou dimension filter
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addOrgUnitFilter(['O6uvpzGd5pu', 'lc3eMKXaEfw'])
         *    .addOrgUnitFilter('OU_GROUP-w0gFTTmsUcF')
         *
         * // filter=ou:O6uvpzGd5pu;lc3eMKXaEfw;OU_GROUP-w0gFTTmsUcF
         */
        addOrgUnitFilter(items) {
            return this.addFilter('ou', items)
        }

        /**
         * Adds a filter to the request.
         *
         * @param {!String} dimension The dimension to add as filter to the request
         * @param {(String|Array)} items The dimension items to add to the dimension filter
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addFilter('Bpx0589u8y0', ['oRVt7g429ZO', 'MAs88nJc9nL'])
         *    .addFilter('qrur9Dvnyt5-Yf6UHoPkdS6');
         *
         * // filter=Bpx0589u8y0:oRVt7g429ZO;MAs88nJc9nL&filter=qrur9Dvnyt5-Yf6UHoPkdS6
         */
        addFilter(dimension, items) {
            let filterIndex = 0

            const existingFilter = this.filters.find((item, index) => {
                if (item.dimension === dimension) {
                    filterIndex = index

                    return item
                }

                return false
            })

            let updatedItems = []
            let existingItems = []

            if (existingFilter) {
                existingItems = existingFilter.items || []
            }

            if (typeof items === 'string') {
                updatedItems = [...new Set([...existingItems, items])]
            } else if (Array.isArray(items)) {
                updatedItems = [...new Set([...existingItems, ...items])]
            }

            if (existingFilter) {
                this.filters.splice(filterIndex, 1, {
                    dimension,
                    items: updatedItems,
                })
            } else {
                this.filters.push({ dimension, items: updatedItems })
            }

            return new AnalyticsRequest(this)
        }
    }

export default AnalyticsRequestFiltersMixin
