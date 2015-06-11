'use strict';

import {checkType} from 'd2/lib/check';
import {copyOwnProperties} from 'd2/lib/utils';
import jQuery from 'd2/external/jquery';

class Api {
    constructor(jquery) {
        this.jquery = jquery;
        this.baseUrl = '/api';
        this.defaultRequestSettings = {
            data: {},
            contentType: 'application/json',
            type: undefined,
            url: undefined
        };
    }

    get(url, data, options) {
        return this.request('GET', getUrl(this.baseUrl, url), data, options);
    }

    post(url, data) {
        return this.request('POST', getUrl(this.baseUrl, url), JSON.stringify(data));
    }

    remove() {

    }

    //TODO: write tests for update
    update(url, data) {
        return this.request('PUT', url, JSON.stringify(data));
    }

    request(type, url, data, options = {}) {
        checkType(type, 'string', 'Request type');
        checkType(url, 'string', 'Url');

        if (data && data.filter) {
            let theRealFilter = data.filter.reduce((current, filter) => current + '&filter=' + filter, '');
            delete data.filter;
            url += '?' + theRealFilter;
        }

        var api = this;

        return new Promise((resolve, reject) => {
            api.jquery
                .ajax(getOptions({
                    type: type,
                    url: url,
                    data: data || {},
                    dataType: options.dataType || 'json'
                }))
                .then(processSuccess(resolve), processFailure(reject));
        });

        function getOptions(mergeOptions) {
            var options = {};

            copyOwnProperties(options, api.defaultRequestSettings);
            copyOwnProperties(options, mergeOptions);

            return options;
        }
    }

    setBaseUrl(baseUrl) {
        checkType(baseUrl, 'string', 'Base url');

        this.baseUrl = baseUrl;

        return this;
    }
}

Api.getApi = getApi;
function getApi() {
    if (getApi.api) {
        return getApi.api;
    }
    return (getApi.api = new Api(jQuery));
}

function processSuccess(resolve) {
    return (data/*, textStatus, jqXHR*/) => {
        resolve(data);
    };
}

function processFailure(reject) {
    return (jqXHR/*, textStatus, errorThrown*/) => {
        delete jqXHR.then;
        reject(jqXHR);
    };
}

function getUrl(baseUrl, url) {
    //If we are dealing with an absolute url use that instead
    if (new RegExp('^(:?https?:)?//').test(url)) {
        return url;
    }

    var urlParts = [];

    if (baseUrl) {
        urlParts.push(baseUrl);
    }
    urlParts.push(url);

    return urlParts.join('/')
        .replace(new RegExp('(.(?:[^:]))\/\/+', 'g'), '$1/')
        .replace(new RegExp('\/$'), '');
}

export default Api;
