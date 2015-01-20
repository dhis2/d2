describe('My first test', function () {
    it('should have d2', function () {
        expect(window.d2).toBeDefined();
    });

    it('should have jquery', function () {
        expect(window.$).toBeDefined();
    });

    it('should have api on the d2 object', function () {
        for (var stuff in window.d2) {
            console.log(stuff);
        }
        expect(window.d2.api).toBeDefined();
    });

    it('should return jquery on the api object', function () {
        expect(new window.d2.api.getApi().jquery).toBe(window.$);
    });
});