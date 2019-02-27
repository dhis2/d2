import FormData from 'form-data';
import System from '../../system/System';
import fixtures from '../../__fixtures__/fixtures';
import Api from '../Api';

jest.mock('../../system/System');

describe('Api', () => {
    let fetchMock;
    let api;
    let baseFetchOptions;

    beforeEach(() => {
        fetchMock = jest.fn()
            .mockReturnValue(Promise.resolve({
                ok: true,
                text: () => Promise.resolve(fixtures.get('/api/schemas/dataElement')),
            }));

        api = new Api(fetchMock);
        baseFetchOptions = Object.assign({ method: 'GET' }, { headers: new Headers({ 'x-requested-with': 'XMLHttpRequest' }) }, api.defaultFetchOptions);

        System.getSystem = jest.fn().mockReturnValue({
            version: {
                major: 2,
                minor: 25,
            },
        });
    });

    afterEach(() => {
        System.getSystem.mockReset();
    });

    it('should be an function', () => {
        expect(Api).toBeInstanceOf(Function);
    });

    it('should create a new instance of Api', () => {
        expect(new Api(fetchMock)).toBeInstanceOf(Api);
    });

    it('should have a baseUrl property that is set to /api', () => {
        expect(new Api(fetchMock).baseUrl).toBe('/api');
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Api(fetchMock)).toThrowErrorMatchingSnapshot();
    });

    describe('when fetch is not supported', () => {
        let wasFetch;

        beforeEach(() => {
            wasFetch = (window || global).fetch;
            if (window !== undefined) window.fetch = undefined;
            if (global !== undefined) global.fetch = undefined;
        });

        afterEach(() => {
            if (window !== undefined) window.fetch = wasFetch;
            if (global !== undefined) global.fetch = wasFetch;
        });

        it('should throw', () => {
            expect(() => new Api()).toThrowError();
        });
    });

    describe('getApi', () => {
        it('should have a method to get an instance of Api', () => {
            expect(Api.getApi).toBeInstanceOf(Function);
        });

        it('should return a singleton', () => {
            expect(Api.getApi()).toBe(Api.getApi());
        });
    });

    describe('setBaseUrl', () => {
        beforeEach(() => {
            api = new Api(() => {});
        });

        it('should be a method', () => {
            expect(api.setBaseUrl).toBeInstanceOf(Function);
        });

        it('should throw when the base url provided is not a string', () => {
            function shouldThrow() {
                api.setBaseUrl();
            }

            expect(shouldThrow).toThrowError('Base url should be provided');
        });

        it('should set the baseUrl property on the object', () => {
            api.setBaseUrl('/dhis/api');

            expect(api.baseUrl).toBe('/dhis/api');
        });
    });

    describe('setUnauthorizedCallback', () => {
        beforeEach(() => {
            api = new Api(() => {});
        });

        it('should be a method', () => {
            expect(api.setUnauthorizedCallback).toBeInstanceOf(Function);
        });

        it('should throw when the base url provided is not a function', () => {
            function shouldThrow() {
                api.setUnauthorizedCallback('asf');
            }

            expect(shouldThrow).toThrowError('Callback must be a function.');
        });

        it('should set the unauthorizedCallback property on the object', () => {
            const cb = () => {};
            api.setUnauthorizedCallback(cb);

            expect(api.unauthorizedCallback).toBe(cb);
        });
    });

    describe('request()', () => {
        it('should handle responses in plain text format', () => {
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('this is not valid json'),
            }));

            expect.assertions(1);

            return api.get('text')
                .then((result) => {
                    expect(result).toBe('this is not valid json');
                });
        });

        it('should handle responses in JSON format', () => {
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('"this is a JSON string"'),
            }));

            expect.assertions(1);

            return api.get('json')
                .then((result) => {
                    expect(result).toBe('this is a JSON string');
                });
        });

        it('should handle complex JSON objects', () => {
            const data = {
                id: '12345',
                name: 'bla bla',
                isEmpty: false,
                subObj: {
                    a: true,
                    b: false,
                },
            };
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(data)),
            }));

            expect.assertions(1);

            return api.get('json')
                .then((result) => {
                    expect(result).toEqual(data);
                });
        });

        it('should report network errors', () => {
            fetchMock.mockReturnValueOnce(Promise.reject(new TypeError('Failed to fetch-o')));

            expect.assertions(2);

            return api.get('http://not.a.real.server/hi')
                .catch((err) => {
                    expect(typeof err).toBe('string');
                    expect(err).toContain('failed');
                });
        });

        it('should report 404 errors', () => {
            const errorText = [
                '{',
                '"httpStatus":"Not Found",',
                '"httpStatusCode":404,',
                '"status":"ERROR",',
                '"message":"DataElement with id 404 could not be found."',
                '}',
            ].join('');
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: false,
                status: 404,
                text: () => Promise.resolve(errorText),
            }));

            expect.assertions(2);

            return api.get('dataElements/404')
                .catch((err) => {
                    expect(typeof err).toBe('object');
                    expect(err).toEqual(JSON.parse(errorText));
                });
        });

        it('should handle 401', () => {
            const response = {
                httpStatus: 'Unauthorized',
                httpStatusCode: 401,
                status: 'ERROR',
                message: 'Unauthorized',
            };
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: false,
                status: 401,
                text: () => Promise.resolve(response),
            }));

            expect.assertions(2);

            return api.get('dataElements/401')
                .catch((err) => {
                    expect(typeof err).toBe('object');
                    expect(err).toEqual(response);
                });
        });

        it('401 should call unauthorizedCb if set', () => {
            const cb = jest.fn();
            api.setUnauthorizedCallback(cb);

            const response = {
                httpStatus: 'Unauthorized',
                httpStatusCode: 401,
                status: 'ERROR',
                message: 'Unauthorized',
            };
            const req = Promise.resolve({
                ok: false,
                status: 401,
                text: () => Promise.resolve(response),
            });
            fetchMock.mockReturnValueOnce(req);

            expect.assertions(2);

            api.get('dataElements/401')
                .catch(() => {
                    expect(cb).toBeCalled();
                    expect(cb).toHaveBeenCalledWith(expect.objectContaining(
                        { method: 'GET', options: {}, url: '/api/dataElements/401' },
                    ), response);
                });
        });

        it('should report 500 errors', () => {
            const errorText = [
                '{',
                '"httpStatus":"Internal Server Error",',
                '"httpStatusCode":500,',
                '"status":"ERROR",',
                '"message":',
                '"object references an unsaved transient instance - save the transient instance before flushing: ',
                'org.hisp.dhis.dataelement.CategoryOptionGroupSet"',
                '}',
            ].join('');
            const data = [
                '{',
                '"name":"District Funding Agency",',
                '"orgUnitLevel":2,',
                '"categoryOptionGroupSet":{"id":"SooXFOUnciJ"}',
                '}',
            ].join('');
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: false,
                status: 500,
                text: () => Promise.resolve(errorText),
            }));

            expect.assertions(2);

            return api.post('dataApprovalLevels', data)
                .catch((err) => {
                    expect(typeof err).toBe('object');
                    expect(err).toEqual(JSON.parse(errorText));
                });
        });

        it('should properly encode URIs', () => {
            expect.assertions(1);

            return api.get('some/endpoint?a=b&c=d|e[with:filter]', {
                f: 'g|h[i,j],k[l|m],n{o~p`q`$r@s!t}',
                u: '-._~:/?#[]@!$&()*+,;===,~$!@*()_-=+/;:',
            })
                .then(() => {
                    expect(fetchMock).toHaveBeenCalledWith([
                        '/api/some/endpoint?',
                        'a=b&',
                        'c=d%7Ce%5Bwith:filter%5D&',
                        'f=g%7Ch%5Bi%2Cj%5D%2Ck%5Bl%7Cm%5D%2Cn%7Bo~p%60q%60%24r%40s!t%7D&',
                        'u=-._~%3A%2F%3F%23%5B%5D%40!%24%26()*%2B%2C%3B%3D%3D%3D%2C~%24!%40*()_-%3D%2B%2F%3B%3A',
                    ].join(''),
                    baseFetchOptions,
                    );
                });
        });

        it('should reject with an error when url contains encoded query string', () => {
            const message = 'Cannot process URL-encoded URLs, pass an unencoded URL';

            expect.assertions(2);

            return api.get('test?one=%5Bwith%20a%20filter%5D')
                .catch((err) => {
                    expect(err).toBeInstanceOf(Error);
                    expect(err.message).toBe(message);
                });
        });

        it('should reject with an error when url is malformed', () => {
            const message = 'Query parameters in URL are invalid';

            expect.assertions(2);

            return api.get('test?%5')
                .catch((err) => {
                    expect(err).toBeInstanceOf(Error);
                    expect(err.message).toBe(message);
                });
        });

        it('should not break URIs when encoding', () => {
            expect.assertions(1);

            return api.get('test?a=b=c&df,gh')
                .then(() => {
                    expect(fetchMock).toHaveBeenCalledWith(
                        '/api/test?a=b=c&df,gh',
                        baseFetchOptions,
                    );
                });
        });

        it('should encode data as JSON', () => {
            const data = { name: 'Name', code: 'Code_01' };
            expect.assertions(1);

            return api.post('jsonData', data)
                .then(() => {
                    expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify(data));
                });
        });

        it('should not encode text/plain data as JSON', () => {
            const data = 'my data';

            expect.assertions(1);

            return api.post('textData', data, { headers: { 'Content-Type': 'text/plain' } })
                .then(() => {
                    expect(fetchMock.mock.calls[0][1].body).toBe(data);
                });
        });
    });

    describe('get', () => {
        it('should be a method', () => {
            expect(api.get).toBeInstanceOf(Function);
        });

        it('should return a promise', () => {
            expect(api.get('dataElements')).toBeInstanceOf(Promise);
        });

        it('should use the baseUrl when requesting', () => {
            api.get('dataElements');

            expect(fetchMock).toBeCalledWith('/api/dataElements', baseFetchOptions);
        });

        it('should not add a double slash to the url', () => {
            api.get('path/of/sorts//dataElements');

            expect(fetchMock).toBeCalledWith('/api/path/of/sorts/dataElements', baseFetchOptions);
        });

        it('should strip the trailing slash', () => {
            api.get('/dataElements.json/');

            expect(fetchMock).toBeCalledWith('/api/dataElements.json', baseFetchOptions);
        });

        it('should keep a full url if it is given as a base', () => {
            api.baseUrl = 'http://localhost:8090/dhis/api';
            api.get('/dataElements.json');

            expect(fetchMock).toBeCalledWith('http://localhost:8090/dhis/api/dataElements.json', baseFetchOptions);
        });

        it('should keep the the slashes if they are the first two characters', () => {
            api.baseUrl = '//localhost:8090/dhis/api';

            api.get('/dataElements.json');

            expect(fetchMock).toBeCalledWith('//localhost:8090/dhis/api/dataElements.json', baseFetchOptions);
        });

        it('should call the get method on the http object', () => {
            api.get('dataElements');

            expect(fetchMock).toBeCalledWith('/api/dataElements', baseFetchOptions);
        });

        it('should transfer data to the query string', () => {
            api.get('dataElements', { fields: 'id,name' });

            expect(fetchMock).toBeCalledWith('/api/dataElements?fields=id%2Cname', baseFetchOptions);
        });

        it('should call the failure handler when the server can\'t be reached', () => {
            fetchMock.mockReturnValueOnce(Promise.reject());

            expect.assertions(1);

            return api.get('/api/dataElements', { fields: 'id,name' })
                .catch((errMessage) => {
                    expect(errMessage).toMatchSnapshot();
                });
        });

        it('should call the failure handler with the message if a webmessage was returned', () => {
            const errorJson = {
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                status: 'ERROR',
                message: 'DataElementCategory with id sdfsf could not be found.',
            };
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: false,
                text: () => Promise.resolve(JSON.stringify(errorJson)),
            }));

            expect.assertions(1);

            return api.get('/api/dataElements/sdfsf', { fields: 'id,name' })
                .catch((err) => { expect(err).toEqual(errorJson); });
        });

        it('should call the success resolve handler', () => {
            fetchMock.mockReturnValueOnce(Promise.resolve({
                ok: true,
                text: () => Promise.resolve('"Success!"'),
            }));

            expect.assertions(1);

            return api.get('/api/dataElements', { fields: 'id,name' })
                .then((res) => {
                    expect(res).toBe('Success!');
                });
        });

        it('should allow the options to be overridden', () => {
            api.get('dataElements', undefined, { mode: 'no-cors', credentials: 'omit', cache: 'no-cache' });

            expect(fetchMock).toBeCalledWith(
                '/api/dataElements',
                Object.assign(baseFetchOptions, { mode: 'no-cors', credentials: 'omit', cache: 'no-cache' }),
            );
        });

        it('should encode filters', () => {
            api.get('filterTest', { filter: ['a:1', 'b:2'] });

            expect(fetchMock).toBeCalledWith('/api/filterTest?filter=a:1&filter=b:2', baseFetchOptions);
        });

        it('should not double encode filter values', () => {
            api.get('filterTest', { filter: ['name:eq:A & B'] });

            expect(fetchMock).toBeCalledWith('/api/filterTest?filter=name:eq:A%20%26%20B', baseFetchOptions);
        });

        it('should transfer complex filters to the query parameters', () => {
            api.get('complexQueryTest', { fields: ':all', filter: ['id:eq:a0123456789', 'name:ilike:Test'] });

            expect(fetchMock.mock.calls[0][0]).toContain('/api/complexQueryTest?');
            expect(fetchMock.mock.calls[0][0]).toContain('filter=id:eq:a0123456789&filter=name:ilike:Test');
        });
    });

    describe('post', () => {
        it('should be a method', () => {
            expect(api.post).toBeInstanceOf(Function);
        });

        it('should call the api the with the correct data', () => {
            api.post(fixtures.get('/singleUserAllFields').href, fixtures.get('/singleUserOwnerFields'));

            expect(fetchMock).toBeCalledWith(
                fixtures.get('/singleUserAllFields').href,
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }),
                    body: JSON.stringify(fixtures.get('/singleUserOwnerFields')),
                }),
            );
        });

        it('should not stringify plain text data', () => {
            api.post('systemSettings/mySettingsKey', 'string=test', { headers: { 'content-type': 'text/plain' } });

            expect(fetchMock).toBeCalledWith(
                '/api/systemSettings/mySettingsKey',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'text/plain', 'x-requested-with': 'XMLHttpRequest' }),
                    body: 'string=test',
                }),
            );
        });

        it('should post the number zero', () => {
            api.post('systemSettings/numberZero', 0, { headers: { 'content-type': 'text/plain' } });

            expect(fetchMock).toBeCalledWith(
                '/api/systemSettings/numberZero',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'text/plain', 'x-requested-with': 'XMLHttpRequest' }),
                    body: JSON.stringify(0),
                }),
            );
        });

        it('should send plain text boolean true values as "true"', () => {
            api.post('systemSettings/keyTrue', true);

            expect(fetchMock).toBeCalledWith(
                '/api/systemSettings/keyTrue',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }),
                    body: 'true',
                }),
            );
        });

        it('should send plain text boolean false values as "false"', () => {
            api.post('systemSettings/keyTrue', false);

            expect(fetchMock).toBeCalledWith(
                '/api/systemSettings/keyTrue',
                Object.assign(baseFetchOptions, {
                    method: 'POST',
                    headers: new Headers({ 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }),
                    body: 'false',
                }),
            );
        });

        it('should set remove the Content-Type header for form data', () => {
            const data = new FormData();
            data.append('field_1', 'value_1');
            data.append('field_2', 'value_2');

            expect.assertions(2);

            return api.post('form/data', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(() => {
                    expect(fetchMock.mock.calls[0][1].headers.constructor.name).toBe('Headers');
                    expect(fetchMock.mock.calls[0][1].headers.get('Content-Type')).toBeNull();
                });
        });
    });

    describe('delete', () => {
        it('should be a method', () => {
            expect(api.delete).toBeInstanceOf(Function);
        });

        it('should call fetch with the correct DELETE request', () => {
            api.delete(fixtures.get('/singleUserAllFields').href);

            expect(fetchMock).toBeCalledWith(
                fixtures.get('/singleUserAllFields').href,
                Object.assign(baseFetchOptions, {
                    method: 'DELETE',
                }),
            );
        });

        it('should call the correct api endpoint when the url starts with a /', () => {
            api.delete('/users/aUplAx3DOWy');

            const fetchOptions = {
                cache: 'default',
                credentials: 'include',
                headers: {
                    _headers: {
                        'x-requested-with': ['XMLHttpRequest'],
                    },
                },
                method: 'DELETE',
                mode: 'cors',
            };

            expect(fetchMock).toBeCalledWith('/api/users/aUplAx3DOWy', fetchOptions);
        });
    });

    describe('update', () => {
        it('should be a method', () => {
            expect(api.update).toBeInstanceOf(Function);
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

            expect(fetchMock).toBeCalledWith(
                '/api/some/fake/api/endpoint',
                expect.objectContaining(Object.assign(baseFetchOptions, {
                    method: 'PUT',
                    headers: new Headers({ 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }),
                    body: JSON.stringify(data),
                })),
            );
        });

        it('should add the mergeMode param to the url when useMergeStrategy is passed', () => {
            api.update('some/fake/api/endpoint', {}, true);

            const fetchOptions = {
                body: '{}',
                cache: 'default',
                credentials: 'include',
                headers: {
                    _headers: {
                        'content-type': ['application/json'],
                        'x-requested-with': ['XMLHttpRequest'],
                    },
                },
                method: 'PUT',
                mode: 'cors',
            };

            expect(fetchMock).toBeCalledWith('/api/some/fake/api/endpoint?mergeMode=REPLACE', fetchOptions);
        });

        it('should add the mergeStrategy param to the url when useMergeStrategy is passed ' +
            'and the version is 2.22', () => {
            System.getSystem.mockReturnValueOnce({
                version: {
                    major: 2,
                    minor: 22,
                },
            });

            api.update('some/fake/api/endpoint', {}, true);

            const fetchOptions = {
                body: '{}',
                cache: 'default',
                credentials: 'include',
                headers: {
                    _headers: {
                        'content-type': ['application/json'],
                        'x-requested-with': ['XMLHttpRequest'],
                    },
                },
                method: 'PUT',
                mode: 'cors',
            };

            expect(fetchMock).toBeCalledWith('/api/some/fake/api/endpoint?mergeStrategy=REPLACE', fetchOptions);
        });

        it('should support payloads of plain texts', () => {
            api.update('some/fake/api/endpoint', 'a string');

            expect(fetchMock).toBeCalledWith(
                '/api/some/fake/api/endpoint',
                Object.assign(baseFetchOptions, {
                    method: 'PUT',
                    headers: new Headers({ 'Content-Type': 'text/plain', 'x-requested-with': 'XMLHttpRequest' }),
                    body: 'a string',
                }),
            );
        });
    });

    describe('patch', () => {
        it('should be a method', () => {
            expect(api.patch).toBeInstanceOf(Function);
        });

        it('should call the ajax method with the correct PATCH request', () => {
            const data = {
                propAtBaseLevel: {
                    nestedChildThatNeedsTOBeUpdated: false,
                },
            };
            const endpoint = 'some/fake/api/endpoint';


            api.patch(endpoint, data);

            const [endpointParam, fetchOptsParam] = fetchMock.mock.calls[0];
            expect(endpointParam).toEqual(`/api/${endpoint}`);
            expect(fetchOptsParam).toEqual(expect.objectContaining(Object.assign(baseFetchOptions, {
                method: 'PATCH',
                headers: new Headers({ 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }),
                body: JSON.stringify(data),
            })));
        });
    });

    describe('defaultHeaders', () => {
        it('should use the set default headers for the request', () => {
            api.setDefaultHeaders({
                Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=',
                'x-requested-with': 'XMLHttpRequest',
            });

            api.get('/me');

            expect(fetchMock).toBeCalledWith(
                '/api/me',
                Object.assign(baseFetchOptions, {
                    method: 'GET',
                    headers: new Headers({ Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', 'x-requested-with': 'XMLHttpRequest' }),
                }),
            );
        });

        it('should not use the defaultHeaders if specific header has been passed', () => {
            api.setDefaultHeaders({
                Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=',
                'x-requested-with': 'XMLHttpRequest',
            });

            api.get('/me', undefined, { headers: { Authorization: 'Bearer ASDW212331sss', 'x-requested-with': 'XMLHttpRequest' } });

            expect(fetchMock).toBeCalledWith(
                '/api/me',
                Object.assign(baseFetchOptions, {
                    method: 'GET',
                    headers: new Headers({ Authorization: 'Bearer ASDW212331sss', 'x-requested-with': 'XMLHttpRequest' }),
                }),
            );
        });

        it('should still use the default headers for keys that have not been defined', () => {
            api.setDefaultHeaders({
                Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=',
                'Custom-Header': 'Some header data',
            });

            api.get('/me', undefined, { headers: { Authorization: 'Bearer ASDW212331sss' } });

            expect(fetchMock).toBeCalledWith(
                '/api/me',
                Object.assign(baseFetchOptions, {
                    method: 'GET',
                    headers: new Headers({
                        Authorization: 'Bearer ASDW212331sss',
                        'Custom-Header': 'Some header data',
                    }),
                }),
            );
        });
    });
});
