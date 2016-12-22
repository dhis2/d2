import { checkType } from '../lib/check';
import jQuery from '../external/jquery';
import System from '../system/System';

function isIE11() {
    try {
        return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    } catch (e) {
        // If this throws it is probably not a browser so we can assume it is not IE11
    }
    return false;
}

function getMergeStrategyParam(mergeType = 'REPLACE') {
    const system = System.getSystem();

    if (system.version && (Number(system.version.minor) <= 22)) {
        return `mergeStrategy=${mergeType}`;
    }

    return `mergeMode=${mergeType}`;
}

function processSuccess(resolve) {
    return (data/* , textStatus, jqXHR */) => {
        resolve(data);
    };
}

function processFailure(reject) {
    return (jqXHR/* , textStatus, errorThrown */) => {
        if (jqXHR.responseJSON) {
            return reject(jqXHR.responseJSON);
        }

        delete jqXHR.then; // eslint-disable-line no-param-reassign
        return reject(jqXHR);
    };
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

    const fullUrl = urlParts.join('/')
        .replace(new RegExp('(.(?:[^:]))\/\/+', 'g'), '$1/')
        .replace(new RegExp('\/$'), '');

    if (isIE11()) {
        const cacheBreaker = `_=${(new Date).getTime()}`;
        const cacheBreakerQueryParam = /\?/.test(fullUrl) ? `&${cacheBreaker}` : `?${cacheBreaker}`;

        return `${fullUrl}${cacheBreakerQueryParam}`;
    }

    return fullUrl;
}

class Api {
    constructor(jquery) {
        if (!jquery) {
            throw new Error('D2 requires jQuery');
        }

        this.jquery = jquery;
        this.baseUrl = '/api';
        this.defaultRequestSettings = {
            headers: {
                // FIXME: Remove the 'Cache-Control: no-store' header when we figure out how to solve this xhr/jquery bug
                // does not process consecutive requests for the same url properly due to the 304 response.
                // It makes no sense to set a 'Cache-Control: no-store' on a request...
                'Cache-Control': 'no-store',
            },
            data: {},
            contentType: 'application/json',
            type: undefined,
            url: undefined,
        };
    }

    get(url, data, options) {
        return this.request('GET', getUrl(this.baseUrl, url), data, options);
    }

    post(url, data, options) {
        // Pass data through JSON.stringify, unless options.contentType is 'text/plain' or false (meaning don't process)
        const
            payload = (
                options &&
                options.contentType !== undefined &&
                (options.contentType === 'text/plain' || options.contentType === false)
            ) ? data : JSON.stringify(data);
        return this.request('POST', getUrl(this.baseUrl, url), payload, options);
    }

    delete(url, options) {
        return this.request('DELETE', getUrl(this.baseUrl, url), undefined, options);
    }

    update(url, data, useMergeStrategy = false) {
        // Since we are currently using PUT to save the full state back, we have to use mergeMode=REPLACE
        // to clear out existing values
        const urlForUpdate = useMergeStrategy === true ? `${url}?${getMergeStrategyParam()}` : url;

        return this.request('PUT', getUrl(this.baseUrl, urlForUpdate), JSON.stringify(data));
    }

    request(type, url, data, options = {}) {
        checkType(type, 'string', 'Request type');
        checkType(url, 'string', 'Url');
        let requestUrl = url;

        if (data && data.filter) {
            const urlQueryParams = data.filter
                // `${str}${separator}${filter}`
                .reduce((str, filter) => {
                    const separator = str.length ? '&' : '';
                    const filterQuery = `filter=${filter}`;

                    return `${str}${separator}${filterQuery}`;
                }, '');

            delete data.filter; // eslint-disable-line no-param-reassign
            requestUrl += `?${urlQueryParams}`;
        }

        const api = this;

        function getOptions(mergeOptions, requestData) {
            let payload = requestData;
            if (payload === undefined) {
                payload = {};
            } else if (payload === true || payload === false) {
                payload = payload.toString();
            }

            const resultOptions = Object.assign({}, api.defaultRequestSettings, mergeOptions);

            resultOptions.type = type;
            resultOptions.url = requestUrl;
            resultOptions.data = payload;
            resultOptions.dataType = options.dataType !== undefined ? options.dataType : 'json';
            resultOptions.contentType = options.contentType !== undefined ? options.contentType : 'application/json';

            // Only set content type when there is data to send
            // GET requests and requests without data do not need a Content-Type header
            // 0 and false are valid requestData values and therefore should have a content type
            if (type === 'GET' || (!requestData && requestData !== 0 && requestData !== false)) {
                resultOptions.contentType = undefined;
            }

            return resultOptions;
        }

        return new Promise((resolve, reject) => {
            api.jquery
                .ajax(getOptions(options, data))
                .then(processSuccess(resolve), processFailure(reject));
        });
    }

    setBaseUrl(baseUrl) {
        checkType(baseUrl, 'string', 'Base url');

        this.baseUrl = baseUrl;

        return this;
    }
}

function getApi() {
    if (getApi.api) {
        return getApi.api;
    }
    return (getApi.api = new Api(jQuery));
}

Api.getApi = getApi;

export default Api;
