/**
 * @private
 * @type {Set}
 */
export const noCreateAllowedFor = new Set([
    'categoryOptionCombo',
]);

export default {
    baseUrl: '/api',
    i18n: {
        sources: new Set(),
        strings: new Set(),
    },
};
