/* global global */
'use strict';
var console;
var check = require('../lib/check');

class Logger {
    constructor(logging) {
        check.checkType(logging, 'object', 'console');
        console = logging;
    }

    canLog(type) {
        return !!(type && console && check.isType(console[type], 'function'));
    }

    debug(...rest) {
        if (this.canLog('debug')) {
            console.debug.apply(console, rest);
            return true;
        }
        return false;
    }

    error(...rest) {
        if (this.canLog('error')) {
            console.log(arguments);
            console.error.apply(console, rest);
            return true;
        }
        return false;
    }

    log(...rest) {
        if (this.canLog('log')) {
            console.log.apply(console, rest);
            return true;
        }
        return false;
    }

    warn(...rest) {
        if (this.canLog('warn')) {
            console.warn.apply(console, rest);
            return true;
        }
        return false;
    }
}

Logger.getLogger = function () {
    if (this.logger) {
        return this.logger;
    }
    return (this.logger = new Logger(global.console));
};

export default Logger;
