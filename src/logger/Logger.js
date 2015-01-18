/* global global */
'use strict';
var console;

var check = require('../lib/check');

module.exports = Logger;

function Logger(logging) {
    check.checkType(logging, 'object', 'console');
    console = logging;

    this.debug = debug;
    this.error = error;
    this.log = log;
    this.warn = warn;
}

Logger.getLogger = function () {
    if (this.logger) {
        return this.logger;
    }
    return (this.logger = new Logger(console));
};

function debug() {
    if (canLog('debug')) {
        console.debug.apply(null, arguments);
        return true;
    }
    return false;
}

function error() {
    if (canLog('error')) {
        console.error.apply(null, arguments);
        return true;
    }
    return false;
}

function log() {
    if (canLog('log')) {
        console.log.apply(null, arguments);
        return true;
    }
    return false;
}

function warn() {
    if (canLog('warn')) {
        console.warn.apply(null, arguments);
        return true;
    }
    return false;
}

function canLog(type) {
    return !!(type && console && check.isType(console[type], 'function'));
}
