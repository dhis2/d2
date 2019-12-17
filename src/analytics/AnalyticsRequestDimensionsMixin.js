import AnalyticsRequest from './AnalyticsRequest';

/**
 * @private
 * @description
 * AnalyticsRequest dimensions mixin function
 *
 * @param {*} base The base class to mix onto
 * @return {module:analytics.AnalyticsRequestDimensionsMixin} The mixin class
 */
const AnalyticsRequestDimensionsMixin = base =>
    /**
     * @private
     * @description
     * AnalyticsRequest dimensions mixin class
     *
     * @alias module:analytics.AnalyticsRequestDimensionsMixin
     */
    class extends base {
        /**
         * Adds/updates the dx dimension to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the dx dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU'])
         *    .addDataDimension('BfMAe6Itzgt.REPORTING_RATE');
         *
         * // dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU;BfMAe6Itzgt.REPORTING_RATE
         *
         */
        addDataDimension(items) {
            return this.addDimension('dx', items);
        }

        /**
         * Adds/updates the pe dimension to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the pe dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addPeriodDimension(['201701', '201702'])
         *    .addPeriodDimension('LAST_4_QUARTERS');
         *
         * // dimension=pe:201701;201702;LAST_4_QUARTERS
         */
        addPeriodDimension(items) {
            return this.addDimension('pe', items);
        }

        /**
         * Adds/updates the ou dimension to use in the request.
         *
         * @param {!(String|Array)} items The dimension items to add to the ou dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addOrgUnitDimension(['O6uvpzGd5pu', 'lc3eMKXaEfw'])
         *    .addOrgUnitDimension('OU_GROUP-w0gFTTmsUcF');
         *
         * // dimension=ou:O6uvpzGd5pu;lc3eMKXaEfw;OU_GROUP-w0gFTTmsUcF
         */
        addOrgUnitDimension(items) {
            return this.addDimension('ou', items);
        }

        /**
         * Adds a new dimension or updates an existing one to use in the request.
         *
         * @param {!String} dimension The dimension to add to the request
         * @param {(String|Array)} items The dimension items to add to the dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addDimension('Bpx0589u8y0', ['oRVt7g429ZO', 'MAs88nJc9nL'])
         *    .addDimension('qrur9Dvnyt5-Yf6UHoPkdS6');
         *
         * // dimension=Bpx0589u8y0:oRVt7g429ZO;MAs88nJc9nL&dimension=qrur9Dvnyt5-Yf6UHoPkdS6
         */
        addDimension(dimension, items) {
            let dimensionIndex = 0;

            const existingDimension = this.dimensions.find((item, index) => {
                if (item.dimension === dimension) {
                    dimensionIndex = index;

                    return item;
                }

                return false;
            });

            let updatedItems = [];
            let existingItems = [];

            if (existingDimension) {
                existingItems = existingDimension.items || [];
            }

            if (typeof items === 'string') {
                updatedItems = [...new Set([...existingItems, items])];
            } else if (Array.isArray(items)) {
                updatedItems = [...new Set([...existingItems, ...items])];
            }

            if (existingDimension) {
                this.dimensions.splice(dimensionIndex, 1, { dimension, items: updatedItems });
            } else {
                this.dimensions.push({ dimension, items: updatedItems });
            }

            return new AnalyticsRequest(this);
        }
    };

export default AnalyticsRequestDimensionsMixin;
