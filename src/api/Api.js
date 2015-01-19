'use strict';

var check = require('d2/lib/check');

module.exports = Api;

function Api(jquery) {
    this.jquery = jquery;
}
Api.getApi = function getApi() {
    return new Api(require('jquery'));
};

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

function get(url) {
    //jshint validthis:true
    return this.request('GET', url);
}

function post() {

}

function remove() {

}

function update() {

}

function request(type, url) {
    check.checkType(type, 'string', 'Request type');
    check.checkType(url, 'string', 'Url');

    var api = this;

    return new Promise(function (resolve, reject) {
        api.jquery
            .ajax(getOptions({
                type: type,
                url: url
            }))
            .then(
            function transformSuccess(data/*, textStatus, jqXHR*/) {
                resolve(data);
            },
            function transformError(jqXHR/*, textStatus, errorThrown*/) {
                delete jqXHR.then;
                reject(jqXHR);
            }
        );
    });

    function getOptions(mergeOptions) {
        var options = {};
        var key;
        for (key in api.defaultRequestSettings) {
            if (api.defaultRequestSettings.hasOwnProperty(key)) {
                options[key] = api.defaultRequestSettings[key];
            }
        }

        for (key in mergeOptions) {
            if (mergeOptions.hasOwnProperty(key)) {
                options[key] = mergeOptions[key];
            }
        }

        return options;
    }
}

