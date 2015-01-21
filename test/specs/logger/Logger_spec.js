describe('Logger', function () {
    var Logger;
    var logger;
    var consoleMock;

    beforeEach(function () {
        consoleMock = {
            log: jasmine.createSpy('log').and.callThrough(),
            debug: jasmine.createSpy('debug'),
            error: jasmine.createSpy('error'),
            warn: jasmine.createSpy('warn')
        };

        Logger = require('d2/logger/Logger');
        logger = new Logger(consoleMock);
    });

    it('should get the correct Logger instance from the namespace', function () {
        expect(logger).toEqual(jasmine.any(Logger));
    });

    it('should have a log function', function () {
        expect(logger.log).toBeDefined();
        expect(logger.log).toEqual(jasmine.any(Function));
    });

    it('should log to the console', function () {
        logger.log('my message');

        expect(consoleMock.log).toHaveBeenCalledWith('my message');
    });

    it('should return true after successful logging', function () {
        expect(logger.log('my message')).toBe(true);
    });

    it('should not log when it does not exist', function () {
        delete consoleMock.log;

        expect(logger.log('my message')).toBe(false);
    });

    it('should not log if the method does not exist', function () {
        delete consoleMock.warn;

        expect(logger.warn('my message')).toBe(false);
    });

    it('should log a warning', function () {
        expect(logger.warn('my message')).toBe(true);
        expect(consoleMock.warn).toHaveBeenCalledWith('my message');
    });

    it('should log a debug request', function () {
        expect(logger.debug('my message')).toBe(true);
        expect(consoleMock.debug).toHaveBeenCalledWith('my message');
    });

    it('should not log when it does not exist', function () {
        delete consoleMock.debug;

        expect(logger.debug('my message')).toBe(false);
    });

    it('should log an error request', function () {
        expect(logger.error('my message')).toBe(true);
        expect(consoleMock.error).toHaveBeenCalledWith('my message');
    });

    it('should not log when error does not exist', function () {
        delete consoleMock.error;

        expect(logger.error('my message')).toBe(false);
    });

    describe('getLogger', function () {
        it('should return a logger', function () {
            expect(Logger.getLogger()).toEqual(jasmine.any(Logger));
        });

        it('should create a singleton and return that', function () {
            expect(Logger.getLogger()).toBe(Logger.getLogger());
        });
    });
});
