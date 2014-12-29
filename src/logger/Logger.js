/* global isType, checkType */
(function (loggingNamespace, window) {
    'use strict';
    var console;

    loggingNamespace.Logger = Logger;

    function Logger(window) {
        checkType(window, 'object', 'window');

        this.debug = debug;
        this.error =  error;
        this.log = log;
        this.warn = warn;

        console = window.console;
    }

    function debug() {
        if (canLog('debug')) {
            console.debug.apply(window, arguments);
            return true;
        }
        return false;
    }

    function error() {
        if (canLog('error')) {
            console.error.apply(window, arguments);
            return true;
        }
        return false;
    }

    function log() {
        if (canLog('log')) {
            console.log.apply(window, arguments);
            return true;
        }
        return false;
    }

    function warn() {
        if (canLog('warn')) {
            console.warn.apply(window, arguments);
            return true;
        }
        return false;
    }

    function canLog(type) {
        return !!(type && console && isType(console[type], 'function'));
    }

})(window.d2.logger = (window.d2 && window.d2.logger) || {}, window);
