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
        var requestFailedHandler;
        var requestSuccessHandler;

        beforeEach(function () {
            requestSuccessHandler = jasmine.createSpy('Request success');
            requestFailedHandler = jasmine.createSpy('Request failed');
        });

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

        it('should add the data to the call', function () {
            api.get('/api/dataElements', {fields: 'id,name'});

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                data: {
                    fields: 'id,name'
                }
            });
        });

        it('should call the failed reject handler', function (done) {
            jqueryMock.ajax.and.returnValue(Promise.reject(new Error('Request failed')));

            api.get('/api/dataElements', {fields: 'id,name'})
                .catch(requestFailedHandler)
                .then(function () {
                    expect(requestFailedHandler).toHaveBeenCalled();
                    expect(requestFailedHandler).toHaveBeenCalledWith(new Error('Request failed'));
                })
                .then(done);
        });

        it('should call the success resolve handler', function (done) {
            jqueryMock.ajax.and.returnValue(Promise.resolve('Success data'));

            api.get('/api/dataElements', {fields: 'id,name'})
                .then(requestSuccessHandler)
                .then(function () {
                    expect(requestSuccessHandler).toHaveBeenCalled();
                    expect(requestSuccessHandler).toHaveBeenCalledWith('Success data');
                })
                .then(done);
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
