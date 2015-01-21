describe('D2', function () {
    it('should be available on the window', function () {
        expect(window.d2).toBeDefined();
    });

    //it('should have api on the d2 object', function (done) {
    //    window.d2({baseUrl: '/dhis/api'})
    //        .then(function (d2) {
    //            expect(d2.api).toBeDefined();
    //            done();
    //        });
    //});

    //it('should return jquery on the api object', function () {
    //    expect(new window.d2.api.getApi().jquery).toBe(window.$);
    //});
});