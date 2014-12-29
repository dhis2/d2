describe('Logger', function () {
    var Logger;
    var logger;
    var windowMock;

    beforeEach(function () {
        windowMock = {
            console: {
                log: jasmine.createSpy('log'),
                debug: jasmine.createSpy('debug'),
                error: jasmine.createSpy('error')
            }
        };

        Logger = d2.logger.Logger;
        logger = new Logger(windowMock);
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

        expect(windowMock.console.log).toHaveBeenCalledWith('my message');
    });

    it('should return true after successful logging', function () {
        expect(logger.log('my message')).toBe(true);
    });

    it('should not log if the method does not exist', function () {
        expect(logger.warn('my message')).toBe(false);
    });

    it('should log a debug request', function () {
        expect(logger.debug('my message')).toBe(true);
        expect(windowMock.console.debug).toHaveBeenCalledWith('my message');
    });

    it('should log an error request', function () {
        expect(logger.error('my message')).toBe(true);
        expect(windowMock.console.error).toHaveBeenCalledWith('my message');
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
