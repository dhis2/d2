import d2 from '../../src/d2';

describe('D2', function () {
    var server;

    beforeEach(function (done) {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        // Show the requests made to the fake server.
        //server.xhr.addFilter(function (method, url) {
        //    console.log(method, url);
        //    return false;
        //});

        server.respondWith(
            'GET',
            '/dhis/api/schemas',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/attributes\?fields=%3Aall%2CoptionSet%5B%3Aall%2Coptions%5B%3Aall%5D%5D&paging=false$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({attributes: []})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\/authorization$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify([])
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\?fields=%3Aall%2CorganisationUnits%5Bid%5D%2CuserGroups%5Bid%5D%2CuserCredentials%5B%3Aall%2C!user%2CuserRoles%5Bid%5D$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/userSettings\/keyUiLocale$/,
            [
                200,
                {'Content-Type': 'text/plain'},
                'en'
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/system\/info$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({version: '2.21'})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/apps$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({apps: []})
            ]
        );

        d2.init({baseUrl: '/dhis/api'})
            .then(function (initialisedD2) {
                window.d2 = initialisedD2;
                done();
            })
            .catch(done);
    });

    it('should be available on the window', function () {
        expect(d2).to.not.be.undefined;
    });

    it('should return jquery on the api object', function () {
        expect(new window.d2.Api.getApi().jquery).to.equal(window.$);
    });
});
