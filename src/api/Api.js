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
    get: get,
    post: post,
    remove: remove,
    update: update,
    request: request,
    defaultRequestSettings: {
        data: {},
        dataType: 'json',
        type: undefined,
        url: undefined
    }
};

function get(url, data) {
    //jshint validthis:true
    return this.request('GET', url, data);
}

function post() {

}

function remove() {

}

function update() {

}

function request(type, url, data) {
    //jshint validthis:true
    check.checkType(type, 'string', 'Request type');
    check.checkType(url, 'string', 'Url');

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
