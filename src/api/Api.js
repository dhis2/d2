'use strict';

var check = require('d2/lib/check');
var utils = require('d2/lib/utils');

module.exports = Api;

function Api(jquery) {
    this.jquery = jquery;
}
Api.getApi = getApi;
function getApi() {
    return new Api(require('jquery'));
}

Api.prototype =  {
    baseUrl: '/api',
    get: get,
    post: post,
    remove: remove,
    setBaseUrl: setBaseUrl,
    update: update,
    request: request,
    defaultRequestSettings: {
        data: {},
        dataType: 'json',
        type: undefined,
        url: undefined
    }
};

function setBaseUrl(baseUrl) {
    check.checkType(baseUrl, 'string', 'Base url');

    //jshint validthis:true
    this.baseUrl = baseUrl;

    return this;
}

function get(url, data) {
    //jshint validthis:true
    return this.request('GET', getUrl(this.baseUrl, url), data);
}

function post() {

}

function remove() {

}

function update() {

}

function request(type, url, data) {
    check.checkType(type, 'string', 'Request type');
    check.checkType(url, 'string', 'Url');

    //jshint validthis:true
    var api = this;

    return new Promise(function (resolve, reject) {
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

        utils.copyOwnProperties(options, api.defaultRequestSettings);
        utils.copyOwnProperties(options, mergeOptions);

        return options;
    }
}

function processSuccess(resolve) {
    return function (data/*, textStatus, jqXHR*/) {
        resolve(data);
    };
}

function processFailure(reject) {
    return function (jqXHR/*, textStatus, errorThrown*/) {
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
        .replace(/\/(\/)+/g, '/')
        .replace(/\/$/, '');
}
