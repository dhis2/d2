/* global System */
describe('D2', function () {
    var server;
    var d2;

    beforeEach(function (done) {
        System.import('d2')
            .then(function (require) {
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

                require.default({baseUrl: '/dhis/api'})
                    .then(function (initialisedD2) {
                        window.d2 = initialisedD2;
                        done();
                    });
            });
    });

    beforeEach(function () {
        d2 = window.d2;
    });

    it('should be available on the window', function () {
        expect(d2).to.be.defined;
    });

    it('should return jquery on the api object', function () {
        expect(new window.d2.Api.getApi().jquery).to.equal(window.$);
    });
});
