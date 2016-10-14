import '../../setup/setup';
import System from '../../../src/system/System';

const proxyquire = require('proxyquire');
proxyquire('../../../src/api/Api', {});

import fixtures from '../../fixtures/fixtures';
import Api from '../../../src/api/Api';

// Mock FormData as it is not available in NodeJs
global.FormData = function FormData() {}
global.FormData.prototype.append = function () {};

describe('Api', () => {
    let fetchMock;
    let api;
    let baseFetchOptions;

    beforeEach(() => {
        fetchMock = stub().returns(Promise.resolve({
            ok: true,
            text: () => Promise.resolve(fixtures.get('/api/schemas/dataElement')),
        }));

        api = new Api(fetchMock);
        baseFetchOptions = Object.assign({ method: 'GET' }, { headers: new Headers() }, api.defaultFetchOptions);

        sinon.stub(System, 'getSystem').returns({
            version: {
                major: 2,
                minor: 25,
            },
        });
    });

    afterEach(() => {
        System.getSystem.restore();
    });

    it('should be an function', () => {
        expect(Api).to.be.instanceof(Function);
    });

    it('should create a new instance of Api', () => {
        expect(new Api(fetchMock)).to.be.instanceof(Api);
    });

    it('should have a baseUrl property that is set to /api', () => {
        expect(new Api(fetchMock).baseUrl).to.equal('/api');
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Api(fetchMock)).to.throw('Cannot call a class as a function'); // eslint-disable-line
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
            api = new Api(() => {});
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

    describe('request()', () => {
        it('should handle responses in plain text format', done => {
            fetchMock.returns(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('this is not valid json'),
            }));

            api.get('text')
                .then(result => {
                    expect(result).to.equal('this is not valid json');
                    done();
                })
                .catch(done);
        });

        it('should handle responses in JSON format', done => {
            fetchMock.returns(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('"this is a JSON string"'),
            }));

            api.get('json')
                .then(result => {
                    expect(result).to.equal('this is a JSON string');
                    done();
                })
                .catch(done);
        });

        it('should handle complex JSON objects', done => {
            const data = {
                id: '12345',
                name: 'bla bla',
                isEmpty: false,
                subObj: {
                    a: true,
                    b: false,
                },
            };
            fetchMock.returns(Promise.resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(data)),
            }));

            api.get('json')
                .then(result => {
                    expect(result).to.deep.equal(data);
                    done();
                })
                .catch(done);
        });

        it('should report network errors', done => {
            fetchMock.returns(Promise.reject(new TypeError('Failed to fetch')));

            api.get('http://not.a.real.server/hi')
                .then(done)
                .catch(err => {
                    expect(err).to.be.a('string');
                    expect(err).to.have.string('failed');
                    done();
                })
                .catch(done);
        });

        it('should report 404 errors', done => {
            const errorText = '{"httpStatus":"Not Found","httpStatusCode":404,"status":"ERROR","message":"DataElement with id 404 could not be found."}';
            fetchMock.returns(Promise.resolve({
                ok: false,
                status: 404,
                text: () => Promise.resolve(errorText),
            }));

            api.get('dataElements/404')
                .then(() => { done(new Error('The request succeeded')); })
                .catch(err => {
                    expect(err).to.be.an('object');
                    expect(err).to.deep.equal(JSON.parse(errorText));
                    done();
                })
                .catch(done);
        });

        it('should report 500 errors', done => {
            const errorText = '{"httpStatus":"Internal Server Error","httpStatusCode":500,"status":"ERROR","message":"object references an unsaved transient instance - save the transient instance before flushing: org.hisp.dhis.dataelement.CategoryOptionGroupSet"}';
            const data = '{"name":"District Funding Agency","orgUnitLevel":2,"categoryOptionGroupSet":{"id":"SooXFOUnciJ"}}';
            fetchMock.returns(Promise.resolve({
                ok: false,
                status: 500,
                text: () => Promise.resolve(errorText),
            }));

            api.post('dataApprovalLevels', data)
                .then(() => { done(new Error('The request succeeded')); })
                .catch(err => {
                    expect(err).to.be.an('object');
                    expect(err).to.deep.equal(JSON.parse(errorText));
                    done();
                })
                .catch(done);
        });

        it('should properly encode URIs', done => {
            api.get('some/endpoint?a=b&c=d|e', { f: 'g|h[i,j],k[l|m],n{o~p`q`$r@s!t}', u : '-._~:/?#[]@!$&()*+,;===,~$!@*()_-=+/;:' })
                .then(() => {
                    expect(fetchMock).to.have.been.calledWith(
                        '/api/some/endpoint?a=b&c=d%7Ce&f=g%7Ch%5Bi,j%5D,k%5Bl%7Cm%5D,n%7Bo~p%60q%60$r%40s!t%7D&u=-._~:/%3F%23%5B%5D%40!$&()*%2B,;===,~$!%40*()_-=%2B/;:'
                    );
                    done();
                })
                .catch(done);
        });

        it('should not break URIs when encoding', done => {
            api.get('test?a=b=c&df,gh')
                .then(() => {
                    expect(fetchMock).to.have.been.calledWith(
                        '/api/test?a=b=c&df,gh'
                    );
                    done();
                })
                .catch(done);
        });

        it('should encode data as JSON', done => {
            const data = { name: 'Name', code: 'Code_01' };
            api.post('jsonData', data)
                .then(() => {
                    expect(fetchMock.args[0][1].body).to.equal(JSON.stringify(data));
                    done();
                })
                .catch(done);
        });

        it('should not encode text/plain data as JSON', done => {
            const data = 'my data';
            api.post('textData', data, { headers: { 'Content-Type': 'text/plain' } })
                .then(() => {
                    expect(fetchMock.args[0][1].body).to.equal(data);
                    done();
                })
                .catch(done);
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

            expect(fetchMock).to.be.calledWith('/api/dataElements');
        });

        it('should not add a double slash to the url', () => {
            api.get('path/of/sorts//dataElements');

            expect(fetchMock).to.be.calledWith('/api/path/of/sorts/dataElements');
        });

        it('should strip the trailing slash', () => {
            api.get('/dataElements.json/');

            expect(fetchMock).to.be.calledWith('/api/dataElements.json');
        });

        it('should keep a full url if it is given as a base', () => {
            api.baseUrl = 'http://localhost:8090/dhis/api';
            api.get('/dataElements.json');

            expect(fetchMock).to.be.calledWith('http://localhost:8090/dhis/api/dataElements.json');
        });

        it('should keep the the slashes if they are the first two characters', () => {
            api.baseUrl = '//localhost:8090/dhis/api';

            api.get('/dataElements.json');

            expect(fetchMock).to.be.calledWith('//localhost:8090/dhis/api/dataElements.json');
        });

        it('should call the get method on the http object', () => {
            api.get('dataElements');

            expect(fetchMock).to.be.calledWith('/api/dataElements', baseFetchOptions);
        });

        it('should transfer data to the query string', () => {
            api.get('dataElements', { fields: 'id,name' });

            expect(fetchMock).to.be.calledWith('/api/dataElements?fields=id,name', baseFetchOptions);
        });

        it('should call the failure handler when the server can\'t be reached', (done) => {
            fetchMock.returns(Promise.reject());

            api.get('/api/dataElements', { fields: 'id,name' })
                .then(() => { throw new Error('Request did not fail') })
                .catch(() => done())
                .catch(done);
        });

        it('should call the failure handler with the message if a webmessage was returned', (done) => {
            const errorJson = {
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                status: 'ERROR',
                message: 'DataElementCategory with id sdfsf could not be found.',
            };
            fetchMock.returns(Promise.resolve({
                ok: false,
                text: () => Promise.resolve(JSON.stringify(errorJson)),
            }));

            api.get('/api/dataElements/sdfsf', { fields: 'id,name' })
                .then(() => { done('The request did not fail'); })
                .catch((err) => { expect(err).to.deep.equal(errorJson); done() });
        });

        it('should call the success resolve handler', (done) => {
            fetchMock.returns(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('"Success!"'),
            }));

            api.get('/api/dataElements', { fields: 'id,name' })
                .then((res) => {
                    expect(res).to.equal('Success!');
                    done();
                }, done);
        });

        it('should allow the options to be overridden', () => {
            api.get('dataElements', undefined, { mode: 'no-cors', credentials: 'omit', cache: 'no-cache' });

            expect(fetchMock).to.be.calledWith(
                '/api/dataElements',
                Object.assign(baseFetchOptions, { mode: 'no-cors', credentials: 'omit', cache: 'no-cache' }),
            );
        });

        it('should encode filters', () => {
            api.get('filterTest', { filter: ['a:1', 'b:2'] });

            expect(fetchMock).to.be.calledWith('/api/filterTest?filter=a:1&filter=b:2');
        });

        it('should transfer complex filters to the query parameters', done => {
            api.get('complexQueryTest', { fields: ':all', filter: ['id:eq:a0123456789', 'name:ilike:Test'] });

            expect(fetchMock.args[0][0]).to.have.string('/api/complexQueryTest?');
            expect(fetchMock.args[0][0]).to.have.string('filter=id:eq:a0123456789&filter=name:ilike:Test');
            done();
        });
    });

    describe('post', () => {
        it('should be a method', () => {
            expect(api.post).to.be.instanceof(Function);
        });

        it('should call the api the with the correct data', () => {
            api.post(fixtures.get('/singleUserAllFields').href, fixtures.get('/singleUserOwnerFields'));

            expect(fetchMock).to.be.calledWith(
                fixtures.get('/singleUserAllFields').href,
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(fixtures.get('/singleUserOwnerFields')),
                })
            );
        });

        it('should not stringify plain text data', () => {
            api.post('systemSettings/mySettingsKey', 'string=test', { headers: { 'content-type': 'text/plain' } });

            expect(fetchMock).to.be.calledWith(
                '/api/systemSettings/mySettingsKey',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'text/plain' }),
                    body: 'string=test',
                })
            );
        });

        it('should post the number zero', () => {
            api.post('systemSettings/numberZero', 0, { headers: { 'content-type': 'text/plain' } });

            expect(fetchMock).to.be.calledWith(
                '/api/systemSettings/numberZero',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'text/plain' }),
                    body: JSON.stringify(0),
                })
            );
        });

        it('should post the number zero with the deprecated dataType option', () => {
            api.post('systemSettings/numberZero', 0, { dataType: 'text' });

            expect(fetchMock).to.be.calledWith(
                '/api/systemSettings/numberZero',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ accept: 'text/plain', 'content-type': 'application/json' }),
                    body: JSON.stringify(0),
                })
            );
        });

        it('should send plain text boolean true values as "true"', () => {
            api.post('systemSettings/keyTrue', true);

            expect(fetchMock).to.be.calledWith(
                '/api/systemSettings/keyTrue',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'application/json' }),
                    body: 'true',
                }),
            );
        });

        it('should send plain text boolean false values as "false"', () => {
            api.post('systemSettings/keyTrue', false);

            expect(fetchMock).to.be.calledWith(
                '/api/systemSettings/keyTrue',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'application/json' }),
                    body: 'false',
                }),
            );
        });

        it('should set remove the Content-Type header for form data', (done) => {
            const data = new FormData();
            data.append('field_1', 'value_1');
            data.append('field_2', 'value_2');

            api.post('form/data', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(() => {
                    expect(fetchMock.args[0][1].headers.constructor.name).to.equal('Headers');
                    expect(fetchMock.args[0][1].headers.get('Content-Type')).to.be.null;
                    done();
                })
                .catch(done);
        });

        it('should not try to determine the type of data if no data is provided', done => {
            api.post('no/data')
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('delete', () => {
        it('should be a method', () => {
            expect(api.delete).to.be.instanceof(Function);
        });

        it('should call fetch with the correct DELETE request', () => {
            api.delete(fixtures.get('/singleUserAllFields').href);

            expect(fetchMock).to.be.calledWith(
                fixtures.get('/singleUserAllFields').href,
                Object.assign(baseFetchOptions, {
                    method: 'DELETE',
                }),
            );
        });

        it('should call the correct api endpoint when the url starts with a /', () => {
            api.delete('/users/aUplAx3DOWy');

            expect(fetchMock).to.be.calledWith('/api/users/aUplAx3DOWy');
        });
    });

    describe('update', () => {
        it('should be a method', () => {
            expect(api.update).to.be.instanceof(Function);
        });

        it('should call the ajax method with the correct UPDATE request', () => {
            const data = {
                a: 'A',
                b: 'B!',
                obj: {
                    oa: 'o.a',
                    ob: 'o.b',
                },
                arr: [1, 2, 3],
            };
            api.update('some/fake/api/endpoint', data);

            expect(fetchMock).to.be.calledWith(
                '/api/some/fake/api/endpoint',
                Object.assign(baseFetchOptions, {
                    method: 'PUT',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data),
                }),
            );
        });

        it('should add the mergeMode param to the url when useMergeStrategy is passed', () => {
            api.update('some/fake/api/endpoint', {}, true);

            expect(fetchMock).to.be.calledWith('/api/some/fake/api/endpoint?mergeMode=REPLACE');
        });

        it('should add the mergeStrategy param to the url when useMergeStrategy is passed and the version is 2.22', () => {
            System.getSystem.returns({
                version: {
                    major: 2,
                    minor: 22,
                },
            });

            api.update('some/fake/api/endpoint', {}, true);

            expect(fetchMock).to.be.calledWith('/api/some/fake/api/endpoint?mergeStrategy=REPLACE');
        });
    });
});
