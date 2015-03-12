let proxyquire = require('proxyquire').noCallThru();
proxyquire('d2/api/Api', {
    'd2/external/jquery': {}
});

import fixtures from 'fixtures/fixtures';
import Api from 'd2/api/Api';

describe('Api', () => {
    var jqueryMock;
    var api;

    beforeEach(() => {
        jqueryMock = {
            ajax: stub().returns(Promise.resolve([fixtures.get('/api/schemas/dataElement')]))
        };

        api = new Api(jqueryMock);
    });

    it('should be an function', () => {
        expect(Api).to.be.instanceof(Function);
    });

    it('should create a new instance of Api', () => {
        expect(new Api()).to.be.instanceof(Api);
    });

    it('should have a baseUrl property that is set to /api', () => {
        expect(new Api().baseUrl).to.equal('/api');
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Api()).to.throw('Cannot call a class as a function'); //jshint ignore:line
    });

    describe('getApi', () => {
        it('should have a method to get an instance of Api', () => {
            expect(Api.getApi).to.be.instanceof(Function);
        });

        it('should return a singleton', () => {
            expect(Api.getApi()).to.equal(Api.getApi());
        });
    });

    describe('setBaseUrl', () => {
        var api;

        beforeEach(() => {
            api = new Api({});
        });

        it('should be a method', () => {
            expect(api.setBaseUrl).to.be.instanceof(Function);
        });

        it('should throw when the base url provided is not a string', () => {
            function shouldThrow() {
                api.setBaseUrl();
            }

            expect(shouldThrow).to.throw('Base url should be provided');
        });

        it('should set the baseUrl property on the object', () => {
            api.setBaseUrl('/dhis/api');

            expect(api.baseUrl).to.equal('/dhis/api');
        });
    });

    describe('get', () => {
        var requestFailedHandler;
        var requestSuccessHandler;

        beforeEach(() => {
            requestSuccessHandler = spy();
            requestFailedHandler = spy();
        });

        it('should be a method', () => {
            expect(api.get).to.be.instanceof(Function);
        });

        it('should return a promise', function () {
            expect(api.get('dataElements')).to.be.instanceof(Promise);
        });

        it('should use the baseUrl when requesting', () => {
            api.get('dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should not add a double slash to the url', () => {
            api.get('//dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should strip the trailing slash', () => {
            api.get('/dataElements.json/');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements.json',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should keep a full url if it is given as a base', () => {
            api.baseUrl = 'http://localhost:8090/dhis/api';

            api.get('/dataElements.json');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: 'http://localhost:8090/dhis/api/dataElements.json',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should keep the the slashes if they are the first two characters', () => {
            api.baseUrl = '//localhost:8090/dhis/api';

            api.get('/dataElements.json');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '//localhost:8090/dhis/api/dataElements.json',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should call the get method on the http object', () => {
            api.get('dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {}
            });
        });

        it('should add the data to the call', () => {
            api.get('dataElements', {fields: 'id,name'});

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {
                    fields: 'id,name'
                }
            });
        });

        it('should call the failed reject handler', function (done) {
            jqueryMock.ajax.returns((function () {
                return new Promise(function (resolve, reject) {
                    reject(new Error('Request failed'));
                });
            })());

            api.get('/api/dataElements', {fields: 'id,name'})
                .catch(requestFailedHandler)
                .then(() => {
                    expect(requestFailedHandler).to.be.called;
                    expect(requestFailedHandler).to.be.calledWith(new Error('Request failed'));
                    done();
                });
        });

        it('should call the success resolve handler', function (done) {
            jqueryMock.ajax.returns(Promise.resolve('Success data'));

            api.get('/api/dataElements', {fields: 'id,name'})
                .then(requestSuccessHandler)
                .then(function () {
                    expect(requestSuccessHandler).to.be.called;
                    expect(requestSuccessHandler).to.be.calledWith('Success data');
                    done();
                });
        });
    });

    describe('post', () => {
        it('should be a method', () => {
            expect(api.post).to.be.instanceof(Function);
        });

        it('should call the api the with the correct data', function () {
            api.post(fixtures.get('singleUserAllFields').href, fixtures.get('singleUserOwnerFields'));

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: fixtures.get('singleUserAllFields').href,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(fixtures.get('singleUserOwnerFields'))
            });
        });
    });

    describe('remove', () => {
        it('should be a method', () => {
            expect(api.remove).to.be.instanceof(Function);
        });
    });

    describe('update', () => {
        it('should be a method', () => {
            expect(api.update).to.be.instanceof(Function);
        });
    });
});
