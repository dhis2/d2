const proxyquire = require('proxyquire');
proxyquire('../../../src/api/Api', {});

import fixtures from '../../fixtures/fixtures';
import Api from '../../../src/api/Api';

// TODO: Can not use import here as babel will not respect the override
// const Api = require('../../../src/api/Api');

describe('Api', () => {
    let jqueryMock;
    let api;

    beforeEach(() => {
        jqueryMock = {
            ajax: stub().returns(Promise.resolve([fixtures.get('/api/schemas/dataElement')])),
        };

        api = new Api(jqueryMock);
    });

    it('should be an function', () => {
        expect(Api).to.be.instanceof(Function);
    });

    it('should throw an error if jQuery isn\'t available', (done) => {
        try {
            const a = new Api();
            done('No error thrown:' + a);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
            done();
        }
    });

    it('should create a new instance of Api', () => {
        expect(new Api(jqueryMock)).to.be.instanceof(Api);
    });

    it('should have a baseUrl property that is set to /api', () => {
        expect(new Api(jqueryMock).baseUrl).to.equal('/api');
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Api(jqueryMock)).to.throw('Cannot call a class as a function'); // eslint-disable-line
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
        let requestFailedHandler;
        let requestSuccessHandler;

        beforeEach(() => {
            requestSuccessHandler = spy();
            requestFailedHandler = spy();
        });

        it('should be a method', () => {
            expect(api.get).to.be.instanceof(Function);
        });

        it('should return a promise', () => {
            expect(api.get('dataElements')).to.be.instanceof(Promise);
        });

        it('should use the baseUrl when requesting', () => {
            api.get('dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {},
            });
        });

        it('should not add a double slash to the url', () => {
            api.get('path/of/sorts//dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/path/of/sorts/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {},
            });
        });

        it('should strip the trailing slash', () => {
            api.get('/dataElements.json/');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements.json',
                dataType: 'json',
                contentType: 'application/json',
                data: {},
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
                data: {},
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
                data: {},
            });
        });

        it('should call the get method on the http object', () => {
            api.get('dataElements');

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {},
            });
        });

        it('should add the data to the call', () => {
            api.get('dataElements', { fields: 'id,name' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'json',
                contentType: 'application/json',
                data: {
                    fields: 'id,name',
                },
            });
        });

        it('should call the failed reject handler', (done) => {
            jqueryMock.ajax.returns((() => {
                return new Promise((resolve, reject) => {
                    reject(new Error('Request failed'));
                });
            })());

            api.get('/api/dataElements', { fields: 'id,name' })
                .catch(requestFailedHandler)
                .then(() => {
                    expect(requestFailedHandler).to.be.called;
                    expect(requestFailedHandler).to.be.calledWith(new Error('Request failed'));
                    done();
                });
        });

        it('should call the failure handler with the message if a webmessage was returned', () => {
            jqueryMock.ajax.returns(Promise.reject({
                responseJSON: {
                    httpStatus: 'Not Found',
                    httpStatusCode: 404,
                    status: 'ERROR',
                    message: 'DataElementCategory with id sdfsf could not be found.',
                },
            }));

            api.get('/api/dataElements', { fields: 'id,name' })
                .catch(requestFailedHandler)
                .then(() => {
                    expect(requestFailedHandler).to.be.called;
                    expect(requestFailedHandler).to.be.calledWith('DataElementCategory with id sdfsf could not be found.');
                    done();
                });
        });

        it('should call the success resolve handler', (done) => {
            jqueryMock.ajax.returns(Promise.resolve('Success data'));

            api.get('/api/dataElements', { fields: 'id,name' })
                .then(requestSuccessHandler)
                .then(() => {
                    expect(requestSuccessHandler).to.be.called;
                    expect(requestSuccessHandler).to.be.calledWith('Success data');
                    done();
                });
        });

        it('should allow the options to be overridden', () => {
            api.get('dataElements', undefined, { dataType: 'text' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/dataElements',
                dataType: 'text',
                contentType: 'application/json',
                data: {},
            });
        });

        it('should encode filters', () => {
            api.get('filterTest', { filter: ['a:1', 'b:2'] });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'GET',
                url: '/api/filterTest?filter=a:1&filter=b:2',
                dataType: 'json',
                contentType: 'application/json',
                data: {},
            });
        });
    });

    describe('post', () => {
        it('should be a method', () => {
            expect(api.post).to.be.instanceof(Function);
        });

        it('should call the api the with the correct data', () => {
            api.post(fixtures.get('singleUserAllFields').href, fixtures.get('singleUserOwnerFields'));

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: fixtures.get('singleUserAllFields').href,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(fixtures.get('singleUserOwnerFields')),
            });
        });

        it('should not stringify plain text data', () => {
            api.post('systemSettings/mySettingsKey', 'string=test', { contentType: 'text/plain' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: '/api/systemSettings/mySettingsKey',
                dataType: 'json',
                contentType: 'text/plain',
                data: 'string=test',
            });
        });

        it('should post the number zero', () => {
            api.post('systemSettings/numberZero', 0, { contentType: 'text/plain' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: '/api/systemSettings/numberZero',
                dataType: 'json',
                contentType: 'text/plain',
                data: 0,
            });
        });

        it('should send plain text boolean true values as "true"', () => {
            api.post('systemSettings/keyTrue', true, { contentType: 'text/plain' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: '/api/systemSettings/keyTrue',
                dataType: 'json',
                contentType: 'text/plain',
                data: 'true',
            });
        });

        it('should send plain text boolean false values as "false"', () => {
            api.post('systemSettings/keyFalse', false, { contentType: 'text/plain' });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: '/api/systemSettings/keyFalse',
                dataType: 'json',
                contentType: 'text/plain',
                data: 'false',
            });
        });

        it('shouldn\'t stringify data if content-type is false', () => {
            api.post('some/api/endpoint', { obj: 'yes' }, { contentType: false });

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'POST',
                url: '/api/some/api/endpoint',
                dataType: 'json',
                contentType: false,
                data: { obj: 'yes' },
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            jqueryMock.ajax = spy();
        });

        it('should be a method', () => {
            expect(api.delete).to.be.instanceof(Function);
        });

        it('should call the ajax method with the correct DELETE request', () => {
            api.delete(fixtures.get('singleUserAllFields').href);

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'DELETE',
                url: fixtures.get('singleUserAllFields').href,
                dataType: 'json',
                contentType: 'application/json',
                data: {},
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            jqueryMock.ajax = spy();
        });

        it('should be a method', () => {
            expect(api.update).to.be.instanceof(Function);
        });

        it('should call the ajax method with the correct UPDATE request', () => {
            const theData = {
                a: 'A',
                b: 'B!',
                obj: {
                    oa: 'o.a',
                    ob: 'o.b',
                },
                arr: [1, 2, 3],
            };
            api.update('some/fake/api/endpoint', theData);

            expect(jqueryMock.ajax).to.be.calledWith({
                type: 'PUT',
                url: '/api/some/fake/api/endpoint',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(theData),
            });
        });
    });
});
