/* global window fetch Headers */
import 'whatwg-fetch';
import { checkType } from '../lib/check';
import { customEncodeURIComponent } from '../lib/utils';
import System from '../system/System';


function getMergeStrategyParam(mergeType = 'REPLACE') {
    const system = System.getSystem();

    if (system.version && (Number(system.version.minor) <= 22)) {
        return `mergeStrategy=${mergeType}`;
    }

    return `mergeMode=${mergeType}`;
}


function getUrl(baseUrl, url) {
    // If we are dealing with an absolute url use that instead
    if (new RegExp('^(:?https?:)?//').test(url)) {
        return url;
    }

    const urlParts = [];

    if (baseUrl) {
        urlParts.push(baseUrl);
    }
    urlParts.push(url);

    return urlParts.join('/')
        .replace(new RegExp('(.(?:[^:]))//+', 'g'), '$1/')
        .replace(new RegExp('/$'), '');
}


class Api {
    constructor(fetchImpl) {
        // Optionally provide fetch to the constructor so it can be mocked during testing
        if (typeof fetchImpl === 'function') {
            this.fetch = fetchImpl.bind(typeof window !== 'undefined' ? window : global);
        } else if (typeof fetch !== 'undefined') {
            this.fetch = fetch.bind(typeof window !== 'undefined' ? window : global);
        } else {
            throw new Error('Failed to initialise D2 Api: No fetch implementation is available');
        }

        this.baseUrl = '/api';
        this.defaultFetchOptions = {
            mode: 'cors', // requests to different origins fail
            credentials: 'include', // include cookies with same-origin requests
            cache: 'default',  // See https://fetch.spec.whatwg.org/#concept-request-cache-mode
        };
        this.defaultHeaders = {};
    }

    setDefaultHeaders(headers) {
        this.defaultHeaders = headers;
    }

    get(url, data, options) {
        return this.request('GET', getUrl(this.baseUrl, url), data, options);
    }

    /* eslint-disable complexity */
    post(url, data, options = {}) {
        const requestUrl = getUrl(this.baseUrl, url);
        let payload = data;

        // Ensure that headers are defined and are treated without case sensitivity
        options.headers = new Headers(options.headers || {}); // eslint-disable-line

        if (data !== undefined) {
            // Pass data through JSON.stringify, unless options.contentType is 'text/plain' or false (meaning don't process)
            // TODO: Deprecated - remove in v26
            if (options.contentType) {
                // Display a deprecation warning, except during test
                if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                    const e = new Error();
                    console.warn( // eslint-disable-line
                        'Deprecation warning: Setting `contentType` for API POST requests is deprecated, and support ' +
                        'may be removed in the next major release of D2. In stead you may set the  `Content-Type` ' +
                        'header explicitly. If no `Content-Type` header is specified, the browser will try to ' +
                        'determine one for you.\nRequest:', 'POST', requestUrl, e.stack
                    );
                }

                options.headers.set('Content-Type', 'text/plain');
                delete options.contentType; // eslint-disable-line
            } else if (data.constructor.name === 'FormData') {
                // Ensure that the browser will set the correct Content-Type header for FormData, including boundary
                options.headers.delete('Content-Type');
                payload = data;
            } else if (options.headers.get('Content-Type') === 'text/plain' ||
                      options.headers.get('Content-Type') === 'text/css' ||
                      options.headers.get('Content-Type') === 'text/javascript') {
                payload = String(data);
            } else {
                // Send JSON data by default
                options.headers.set('Content-Type', 'application/json');
                payload = JSON.stringify(data);
            }
        }

        return this.request('POST', requestUrl, payload, options);
    }
    /* eslint-enable complexity */

    delete(url, options) {
        return this.request('DELETE', getUrl(this.baseUrl, url), undefined, options);
    }

    update(url, data, useMergeStrategy = false) {
        // Since we are currently using PUT to save the full state back, we have to use mergeMode=REPLACE
        // to clear out existing values
        const urlForUpdate = useMergeStrategy === true ? `${url}?${getMergeStrategyParam()}` : url;

        return this.request('PUT', getUrl(this.baseUrl, urlForUpdate), JSON.stringify(data));
    }

    /* eslint-disable complexity */
    request(method, url, data, options = {}) {
        checkType(method, 'string', 'Request type');
        checkType(url, 'string', 'Url');
        const api = this;
        let requestUrl = url;
        let query = '';

        if (requestUrl.indexOf('?') !== -1) {
            query = requestUrl.substr(requestUrl.indexOf('?') + 1);
            requestUrl = requestUrl.substr(0, requestUrl.indexOf('?'));
        }

        // Transfer filter properties from the data object to the query string
        if (data && Array.isArray(data.filter)) {
            const encodedFilters = data.filter
                .map(filter => filter.split(':').map(encodeURIComponent).join(':'));

            query = `${customEncodeURIComponent(query)}${query.length ? '&' : ''}filter=${encodedFilters.join('&filter=')}`;
            delete data.filter; // eslint-disable-line no-param-reassign
        }

        // When using the GET method, transform the data object to query parameters
        if (data && method === 'GET') {
            Object.keys(data)
                .forEach((key) => {
                    query = `${query}${(query.length > 0 ? '&' : '')}${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
                });
        }

        function getOptions(defaultHeaders, mergeOptions, requestData) {
            const resultOptions = Object.assign({}, api.defaultFetchOptions, mergeOptions);
            const headers = new Headers(mergeOptions.headers || {});

            Object
                .keys(defaultHeaders)
                .filter(header => !headers.get(header))
                .forEach(header => headers.set(header, defaultHeaders[header]));

            resultOptions.method = method;

            // Only set content type when there is data to send
            // GET requests and requests without data do not need a Content-Type header
            // 0 and false are valid requestData values and therefore should have a content type
            if (resultOptions.method === 'GET' || (!requestData && requestData !== 0 && requestData !== false)) {
                headers.delete('Content-Type');
            } else if (requestData) {
                if (data.constructor.name === 'FormData') {
                    headers.delete('Content-Type');
                } else if (!headers.get('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }
                resultOptions.body = requestData;
            }

            // Handle the dataType option used by jQuery.ajax, but throw a deprecation warning
            // TODO: Remove in 2.26
            if (mergeOptions.dataType) {
                // Display a deprecation warning, except during test
                if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                    const e = new Error();
                    console.warn( // eslint-disable-line
                        'Deprecation warning: Setting `dataType` for API requests is deprecated, and support may be ' +
                        'removed in the next major release of D2. In stead you should set the  `Accept` header ' +
                        'directly.\nRequest:', resultOptions.method, requestUrl, e.stack
                    );
                }

                if (mergeOptions.dataType === 'text') {
                    headers.set('Accept', 'text/plain');
                    delete resultOptions.dataType;
                }
            }

            resultOptions.headers = headers;
            return resultOptions;
        }

        if (query.length) {
            requestUrl = `${requestUrl}?${query}`;
        }
        const requestOptions = getOptions(this.defaultHeaders, options, data);

        // If the provided value is valid JSON, return the parsed JSON object. If not, return the raw value as is.
        function parseResponseData(value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }

        return new Promise((resolve, reject) => {
            // fetch returns a promise that will resolve with any response received from the server
            // It will be rejected ONLY if no response is received from the server, i.e. because there's no internet
            this.fetch(requestUrl, requestOptions)
                .then((response) => {
                    // If the request failed, response.ok will be false and response.status will be the status code
                    if (response.ok) {
                        response.text().then(text => resolve(parseResponseData(text)));
                    } else {
                        response.text().then((text) => {
                            if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                                console.warn( // eslint-disable-line
                                    `API request failed with status ${response.status} ${response.statusText}\n`,
                                    `Request: ${requestOptions.method} ${requestUrl}`
                                );
                            }
                            reject(parseResponseData(text));
                        });
                    }
                })
                .catch((err) => {
                    // It's not usually possible to get much info about the cause of the error programmatically, but
                    // the user can check the browser console for more info
                    if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                        console.error('Server connection error:', err); // eslint-disable-line
                    }
                    reject(`Server connection failed for API request: ${requestOptions.method} ${requestUrl}`);
                });
        });
    }
    /* eslint-enable complexity */

    setBaseUrl(baseUrl) {
        checkType(baseUrl, 'string', 'Base url');

        this.baseUrl = baseUrl;

        return this;
    }

    static getApi() {
        if (Api.getApi.api) {
            return Api.getApi.api;
        }
        return (Api.getApi.api = new Api());
    }
}

export default Api;
