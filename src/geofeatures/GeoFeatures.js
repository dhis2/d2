import Api from '../api/Api';
import { isValidUid } from '../uid';

class GeoFeatures {
    constructor(orgUnits = [], displayProperty) {
        this.orgUnits = orgUnits;
        this.displayName = displayProperty;
    }

    byOrgUnit(orgUnits) {
        if (!orgUnits) {
            return this;
        }

        const orgUnitsArray = [].concat(orgUnits);

        if (!orgUnitsArray.every(this.isValidOrgUnit)) {
            throw new Error(`Invalid organisation unit(s): ${orgUnits}`);
        }

        return new GeoFeatures(orgUnitsArray, this.displayName);
    }

    // TODO Check if value is property
    displayProperty(displayName) {
        if (!displayName) {
            return this;
        }

        if (!this.isValidDisplayName(displayName)) {
            throw new Error(`Invalid display name: ${displayName}`);
        }

        return new GeoFeatures(this.orgUnits, this.userOrgUnits, displayName);
    }

    getAll() {
        const api = Api.getApi();
        const params = {};

        if (this.orgUnits.length) {
            params.ou = `ou:${this.orgUnits.join(';')}`;
        }

        if (this.displayName) {
            params.displayProperty = this.displayName;
        }

        return api.get('geoFeatures', params);
    }

    isValidOrgUnit(orgUnit) {
        return (
            isValidUid(orgUnit) ||
            this.isValidOrgUnitLevel(orgUnit) ||
            this.isValidOrgUnitGroup(orgUnit) ||
            this.isValidUserOrgUnit(orgUnit)
        );
    }

    isValidOrgUnitLevel(level) {
        return /^LEVEL-[0-9]+/.test(level);
    }

    isValidOrgUnitGroup(group) {
        return isValidUid(group.match(/OU_GROUP-(.*)/)[1]);
    }

    isValidUserOrgUnit(orgUnit) {
        return (
            orgUnit === this.USER_ORGUNIT ||
            orgUnit === this.USER_ORGUNIT_CHILDREN ||
            orgUnit === this.USER_ORGUNIT_GRANDCHILDREN
        );
    }

    isValidDisplayName(displayName) {
        return (
            displayName === this.DISPLAY_PROPERTY_NAME ||
            displayName === this.DISPLAY_PROPERTY_SHORTNAME
        );
    }

    static getGeoFeatures(...args) {
        return new GeoFeatures(...args);
    }

    static DISPLAY_PROPERTY_NAME = 'NAME';
    static DISPLAY_PROPERTY_SHORTNAME = 'SHORTNAME';
    static USER_ORGUNIT = 'USER_ORGUNIT';
    static USER_ORGUNIT_CHILDREN = 'USER_ORGUNIT_CHILDREN';
    static USER_ORGUNIT_GRANDCHILDREN = 'USER_ORGUNIT_GRANDCHILDREN';
}

export default GeoFeatures;
