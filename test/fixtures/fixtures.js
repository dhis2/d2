window.fixtures = (function () {
    var fixtures = {};

    return {
        get: getFixture,
        add: addFixture
    };

    function getFixture(fixtureName) {
        if (fixtures && fixtures[fixtureName]) {
            //Deep copy the fixture, so we get a "clean" one
            return jQuery.extend(true, {}, fixtures[fixtureName]);
        }
        throw new Error(['Fixture', fixtureName, 'does not exist'].join(' '));
    }

    function addFixture(fixtureName, fixtureData) {
        if (fixtureName && fixtureData && typeof fixtureName === 'string') {
            fixtures[fixtureName] = fixtureData;
        }
    }

})();

