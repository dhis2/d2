var server;

beforeAll(function (done) {
    server = sinon.fakeServer.create();
    server.autoRespond = true;

    server.respondWith(
        'GET',
        '/dhis/api/schemas',
        [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify(fixtures.get('/api/schemas'))
        ]
    );

    window.d2({baseUrl: '/dhis/api'})
        .then(function (initialisedD2) {
            window.d2 = initialisedD2;
            done();
        });
});

describe('D2', function () {
    var d2;

    beforeEach(function () {
        d2 = window.d2;
    });

    it('should be available on the window', function () {
        expect(d2).toBeDefined();
    });

    it('should return jquery on the api object', function () {
        expect(new window.d2.Api.getApi().jquery).toBe(window.$);
    });
});