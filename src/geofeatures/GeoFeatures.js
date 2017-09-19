import Api from '../api/Api';

/**
 * @class GeoFeatures
 * @description
 * GeoFeatures class that can be used to request organisation units with coordinates.
 */
class GeoFeatures {
    constructor(groups = [], levels = [], ous = []) {
        this.levels = levels;
        this.groups = groups;
        this.ous = ous;
    }

    byLevel(levels) {
        return new GeoFeatures(this.groups, [].concat(levels), this.ous);
    }

    byGroup(groups) {
        return new GeoFeatures([].concat(groups), this.levels, this.ous);
    }

    getFor(ous) {
        return new GeoFeatures(this.groups, this.levels, [].concat(ous));
    }

    getAll() {
        const api = Api.getApi();
        const ouQueryPart = `ou:OU_GROUP-${this.groups.join(':')}`;

        console.log('getAll', this.levels, this.groups, this.ous);

        return api.get({
            OU: ouQueryPart,
        });
    }

    /**
     * @method getDataStore
     * @static
     *
     * @param groups
     * @param levels
     * @param ous
     *
     * @returns {GeoFeatures} A instance of the GeoFeatures class that can be used to request
     * organisation units with coordinates.
     *
     * @description
     * Create a GeoFeatures instance
     */
    static getGeoFeatures(...args) {
        return new GeoFeatures(...args);
    }
}

export default GeoFeatures;
