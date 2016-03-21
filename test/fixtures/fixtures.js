'use strict';

export default (function () {
    var fixtures = {};

    function getFixture(fixtureName) {
        if (fixtures && fixtures[fixtureName]) {
            // Make sure we return a new object
            return JSON.parse(JSON.stringify(fixtures[fixtureName]));
        }
        throw new Error(['Fixture', fixtureName, 'does not exist'].join(' '));
    }

    function addFixture(fixtureName, fixtureData) {
        if (fixtureName && fixtureData && typeof fixtureName === 'string') {
            fixtures[fixtureName] = fixtureData;
        }
    }

    addFixture('me/authorities', require('./json/api/me/authorities.json'));
    addFixture('me', require('./json/api/me.json'));
    addFixture('modelDefinitions/dataElement', require('./json/modelDefinitions/dataElement.json'));
    addFixture('/api/schemas', require('./json/api/schemas.json'));
    addFixture('/api/schemas/user', require('./json/api/schemas/user.json'));
    addFixture('appStore', require('./json/api/appStore.json'));
    addFixture('/api/schemas/organisationUnit', require('./json/api/schemas/organisationUnit.json'));
    addFixture('/api/organisationUnits', require('./json/api/organisationUnits.json'));
    addFixture('/api/dataElements', require('./json/api/dataElements.json'));
    addFixture('singleUserAllFields', require('./json/singleUserAllFields.json'));
    addFixture('singleUserOwnerFields', require('./json/singleUserOwnerFields.json'));
    addFixture('/api/schemas/dataElement', require('./json/api/schemas/dataElement.json'));
    addFixture('/api/schemas/indicatorGroup', require('./json/api/schemas/indicatorGroup.json'));
    addFixture('/api/attributes', require('./json/api/schemas/attributes.json'));
    addFixture('dataElementAttributes', require('./json/dataElementAttributes.json'));

    return {
        get: getFixture,
        add: addFixture,
    };
}());
