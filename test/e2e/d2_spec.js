import d2 from 'd2';

describe('D2', function () {
    var server;

    beforeEach(function (done) {
        server = sinon.fakeServer.create();
        server.autoRespond = true;

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
            /^\/dhis\/api\/attributes\?fields=%3Aall%2CoptionSet%5B%3Aall%5D&paging=false$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({attributes: []})
            ]
        );

        d2.init({baseUrl: '/dhis/api'})
            .then(function (initialisedD2) {
                window.d2 = initialisedD2;
                done();
            });
    });

    it('should be available on the window', function () {
        expect(d2).to.not.be.undefined;
    });

    it('should return jquery on the api object', function () {
        expect(new window.d2.Api.getApi().jquery).to.equal(window.$);
    });
});
