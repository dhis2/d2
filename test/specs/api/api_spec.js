describe('Api', function () {
    var proxyquire = require('proxyquire').noCallThru();
    var jqueryMock;

    var Api;
    var api;

    beforeEach(function () {
        jqueryMock = {
            ajax: jasmine.createSpy('ajax').and.returnValue(Promise.resolve('coool'))
        };

        proxyquire('d2/api/Api', {
             jquery: jqueryMock
        });

        Api = require('d2/api/Api');
        api = new Api(jqueryMock);
    });

    it('should be an function', function () {
        expect(Api).toEqual(jasmine.any(Function));
    });

    it('should create a new instance of Api', function () {
        expect(new Api()).toEqual(jasmine.any(Api));
    });

    describe('getApi', function () {
        it('should have a method to get an instance of Api', function () {
            expect(Api.getApi()).toEqual(jasmine.any(Api));
        });
    });

    describe('get', function () {
        it('should be a method', function () {
            expect(api.get).toEqual(jasmine.any(Function));
        });

        it('should call the get method on the http object', function () {
            api.get('/api/dataElements');

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                data: {}
            });
        });
    });

    describe('post', function () {
        it('should be a method', function () {
            expect(api.post).toEqual(jasmine.any(Function));
        });
    });

    describe('remove', function () {
        it('should be a method', function () {
            expect(api.remove).toEqual(jasmine.any(Function));
        });
    });

    describe('update', function () {
        it('should be a method', function () {
            expect(api.update).toEqual(jasmine.any(Function));
        });
    });
});
