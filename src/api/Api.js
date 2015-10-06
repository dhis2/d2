import {checkType} from 'd2/lib/check';
import {copyOwnProperties} from 'd2/lib/utils';
import jQuery from 'd2/external/jquery';

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

        delete jqXHR.then;
        reject(jqXHR);
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

    return urlParts.join('/')
        .replace(new RegExp('(.(?:[^:]))\/\/+', 'g'), '$1/')
        .replace(new RegExp('\/$'), '');
}

class Api {
    constructor(jquery) {
        this.jquery = jquery;
        this.baseUrl = '/api';
        this.defaultRequestSettings = {
            data: {},
            contentType: 'application/json',
            type: undefined,
            url: undefined,
        };
    }

    get(url, data, options) {
        return this.request('GET', getUrl(this.baseUrl, url), data, options);
    }

    post(url, data) {
        return this.request('POST', getUrl(this.baseUrl, url), JSON.stringify(data));
    }

    delete(url) {
        return this.request('DELETE', getUrl(this.baseUrl, url));
    }

    // TODO: write tests for update
    update(url, data) {
        return this.request('PUT', url, JSON.stringify(data));
    }

    request(type, url, data, options = {}) {
        checkType(type, 'string', 'Request type');
        checkType(url, 'string', 'Url');
        let requestUrl = url;

        if (data && data.filter) {
            const urlQueryParams = data.filter.reduce((current, filter) => current + '&filter=' + filter, '');
            delete data.filter;
            requestUrl += '?' + urlQueryParams;
        }

        const api = this;

        function getOptions(mergeOptions) {
            const resultOptions = {};

            copyOwnProperties(resultOptions, api.defaultRequestSettings);
            copyOwnProperties(resultOptions, mergeOptions);

            return resultOptions;
        }

        return new Promise((resolve, reject) => {
            api.jquery
                .ajax(getOptions({
                    type: type,
                    url: requestUrl,
                    data: data || {},
                    dataType: options.dataType || 'json',
                }))
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
