/* global global */
'use strict';

import {checkType, isType} from 'd2/lib/check';

var console;

class Logger {
    constructor(logging) {
        checkType(logging, 'object', 'console');
        console = logging;
    }

    canLog(type) {
        return !!(type && console && isType(console[type], 'function'));
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
    var console;

    //TODO: This is not very clean try to figure out a better way to do this.
    try {
        //Node version
        console = global.console;
    } catch (e) {
        //Browser version fallback
        console = window.console;
    }

    if (this.logger) {
        return this.logger;
    }
    return (this.logger = new Logger(console));
};

export default Logger;
