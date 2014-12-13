window.fixtures = (function () {
    var fixtures = {};

    return {
        get: getFixture,
        add: addFixture
    };

    function getFixture(fixtureName) {
        if (fixtures && fixtures[fixtureName]) {
            return fixtures[fixtureName];
        }
        throw new Error(['Fixture', fixtureName, 'does not exist'].join(' '));
    }

    function addFixture(fixtureName, fixtureData) {
        if (fixtureName && fixtureData && typeof fixtureName === 'string') {
            fixtures[fixtureName] = fixtureData;
        }
    }

})();

