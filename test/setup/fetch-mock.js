let requestHandlers = new Map();
let isLogging = false;

export function createFetchMock() {
    const oldFetch = window.fetch;

    requestHandlers = new Map();
    
    function fetch(url, options) {
        if (requestHandlers.has(url)) {
            const requestHandlersForUrl = requestHandlers.get(url);
            const method = (options && options.method) || 'GET'; 

            if (requestHandlersForUrl.has(method)) {
                isLogging && console.log(`Found handler for ${method} to ${url}`);
                const spyForRequest = requestHandlersForUrl.get(method);

                return spyForRequest(url, options);
            }
            isLogging && console.error('No handler for ${method}', url);
            return Promise.reject('No handler for ${method}');
        }

        isLogging && console.error(`No handler for request ${url}`);
    }

    fetch.restore = function () {
        window.fetch = oldFetch;
    };

    function requestTo(url, method = 'GET') {
        try {
            return requestHandlers.get(url).get(method);
        } catch (e) {
            throw new Error(`Handler for ${method} to ${url} does not exist`);
        }
    };

    fetch.requests = {
        requestTo,
    };

    window.fetch = fetch;
}

/**
 * Set a response to be given for a combination of url/method
 * 
 * ```js
 * respondTo('/api/users', 'POST')
 *   .with(200, '{ "status":  "Created" }');
 * ```
 * 
 * TODO: Expand this based on payload perhaps
 * 
 * @param {string} url The url that the request will be made to.
 * @param {string} [method=GET] The http request method that this response is for.
 * 
 * @returns {object} Returns an object that can be used to determine the response. The response can be set using `with`, `withJSON` or `withText` where `with` is a shortcut for `withJSON`.
 */
export function respondTo(url, method = 'GET') {
    function withResponse(statusCode, responseBody, headers = { 'Content-type': 'application/json' }) {
        // When status code is not a number we assume 
        if (typeof statusCode !== 'number') {
            headers = responseBody;
            responseBody = statusCode;
            statusCode = 200;
        }

        const response = Promise.resolve(new window.Response(
            responseBody,
            {
                status: statusCode,
                headers,
            }  
        ));

        if (!requestHandlers.has(url)) {
            requestHandlers.set(url, new Map());
        }


        isLogging && console.log(`Registering handler for ${method} to ${url}`);
        return requestHandlers
            .get(url)
            .set(method, sinon.stub().returns(response))
            .get(method);
    }

    return {
        with: withResponse,
        withJSON(statusCode, responseBody, headers) {
            return withResponse(statusCode, responseBody, {
                'Content-type': 'application/json',
                ...headers,
            });
        },
        withText(statusCode, responseBody, headers) {
            return withResponse(statusCode, responseBody, {
                'Content-type': 'text/plain',
                ...headers,
            });
        },
    };
}
