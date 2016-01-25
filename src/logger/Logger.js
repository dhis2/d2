import { checkType, isType } from '../lib/check';

class Logger {
    constructor(logging) {
        checkType(logging, 'object', 'console');
        this.logger = logging;
    }

    canLog(type) {
        return !!(type && console && isType(this.logger[type], 'function'));
    }

    debug(...rest) {
        if (this.canLog('debug')) {
            this.logger.debug.apply(console, rest);
            return true;
        }
        return false;
    }

    error(...rest) {
        if (this.canLog('error')) {
            this.logger.error.apply(console, rest);
            return true;
        }
        return false;
    }

    log(...rest) {
        if (this.canLog('log')) {
            this.logger.log.apply(console, rest);
            return true;
        }
        return false;
    }

    warn(...rest) {
        if (this.canLog('warn')) {
            this.logger.warn.apply(console, rest);
            return true;
        }
        return false;
    }

    static getLogger() {
        let logger;

        // TODO: This is not very clean try to figure out a better way to do this.
        try {
            // Node version
            logger = global.console;
        } catch (e) {
            // Browser version fallback
            /* istanbul ignore next */
            logger = window.console;
        }

        if (this.logger) {
            return this.logger;
        }
        return (this.logger = new Logger(logger));
    }
}

export default Logger;
