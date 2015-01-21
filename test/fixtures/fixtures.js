'use strict';

module.exports = (function () {
    var fixtures = {};

    return {
        get: getFixture,
        add: addFixture
    };

    function getFixture(fixtureName) {
        if (fixtures && fixtures[fixtureName]) {
            //Make sure we return a new object
            return JSON.parse(JSON.stringify(fixtures[fixtureName]));
        }
        throw new Error(['Fixture', fixtureName, 'does not exist'].join(' '));
    }

    function addFixture(fixtureName, fixtureData) {
        if (fixtureName && fixtureData && typeof fixtureName === 'string') {
            fixtures[fixtureName] = fixtureData;
        }
    }

})();

require('./api/shemas/dataElement');
require('./modeldefinitions/dataElement');

