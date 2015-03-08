'use strict';

import {checkType} from 'd2/lib/check';
import {copyOwnProperties} from 'd2/lib/utils';
import jQuery from 'jquery';

class Api {
    constructor(jquery) {
        this.jquery = jquery;
        this.baseUrl = '/api';
        this.defaultRequestSettings = {
            data: {},
            dataType: 'json',
                type: undefined,
                url: undefined
        };
    }

    get(url, data) {
        //jshint validthis:true
        return this.request('GET', getUrl(this.baseUrl, url), data);
    }

    post() {

    }

    remove() {

    }

    update() {

    }

    request(type, url, data) {
        checkType(type, 'string', 'Request type');
        checkType(url, 'string', 'Url');

        var api = this;

        return new Promise((resolve, reject) => {
            api.jquery
                .ajax(getOptions({
                    type: type,
                    url: url,
                    data: data || {}
                }))
                .then(
                processSuccess(resolve),
                processFailure(reject)
            );
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
