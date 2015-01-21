describe('Api', function () {
    var proxyquire = require('proxyquire').noCallThru();
    var fixtures = require('fixtures/fixtures');
    var jqueryMock;

    var Api;
    var api;

    beforeEach(function () {
        jqueryMock = {
            ajax: jasmine.createSpy('ajax')
                .and.returnValue(Promise.resolve([fixtures.get('/api/schemas/dataElement')]))
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

    it('should have a baseUrl property that is set to /api', function () {
        expect(new Api().baseUrl).toBe('/api');
    });

    describe('getApi', function () {
        it('should have a method to get an instance of Api', function () {
            expect(Api.getApi()).toEqual(jasmine.any(Api));
        });
    });

    describe('setBaseUrl', function () {
        var api;

        beforeEach(function () {
            api = new Api({});
        });

        it('should be a method', function () {
            expect(api.setBaseUrl).toEqual(jasmine.any(Function));
        });

        it('should throw when the base url provided is not a string', function () {
            function shouldThrow() {
                api.setBaseUrl();
            }

            expect(shouldThrow).toThrowError('Base url should be provided');
        });

        it('should set the baseUrl property on the object', function () {
            api.setBaseUrl('/dhis/api');

            expect(api.baseUrl).toBe('/dhis/api');
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

        it('should use the baseUrl when requesting', function () {
            api.get('dataElements');

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                data: {}
            });
        });

        it('should not add a double slash to the url', function () {
            api.get('//dataElements');

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                data: {}
            });
        });

        it('should strip the trailing slash', function () {
            api.get('/dataElements.json/');

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements.json',
                dataType: 'json',
                data: {}
            });
        });

        it('should call the get method on the http object', function () {
            api.get('dataElements');

            expect(jqueryMock.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                data: {}
            });
        });

        it('should add the data to the call', function () {
            api.get('dataElements', {fields: 'id,name'});

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
