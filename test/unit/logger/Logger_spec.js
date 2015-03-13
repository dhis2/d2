describe('Logger', () => {
    'use strict';

    var Logger;
    var logger;
    var consoleMock;

    beforeEach(() => {
        consoleMock = {
            log: spy(),
            debug: spy(),
            error: spy(),
            warn: spy()
        };

        Logger = require('d2/logger/Logger');
        logger = new Logger(consoleMock);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Logger()).to.throw('Cannot call a class as a function'); //jshint ignore:line
    });

    it('should get the correct Logger instance from the namespace', () => {
        expect(logger).to.be.instanceof(Logger);
    });

    it('should have a log function', () => {
        expect(logger.log).to.not.be.undefined;
        expect(logger.log).to.be.instanceof(Function);
    });

    it('should log to the console', () => {
        logger.log('my message');

        expect(consoleMock.log).to.have.been.calledWith('my message');
    });

    it('should return true after successful logging', () => {
        expect(logger.log('my message')).to.be.true;
    });

    it('should not log when it does not exist', () => {
        delete consoleMock.log;

        expect(logger.log('my message')).to.be.false;
    });

    it('should not log if the method does not exist', () => {
        delete consoleMock.warn;

        expect(logger.warn('my message')).to.be.false;
    });

    it('should log a warning', () => {
        expect(logger.warn('my message')).to.be.true;
        expect(consoleMock.warn).to.have.been.calledWith('my message');
    });

    it('should log a debug request', () => {
        expect(logger.debug('my message')).to.be.true;
        expect(consoleMock.debug).to.have.been.calledWith('my message');
    });

    it('should not log when it does not exist', () => {
        delete consoleMock.debug;

        expect(logger.debug('my message')).to.be.false;
    });

    it('should log an error request', () => {
        expect(logger.error('my message')).to.be.true;
        expect(consoleMock.error).to.have.been.calledWith('my message');
    });

    it('should not log when error does not exist', () => {
        delete consoleMock.error;

        expect(logger.error('my message')).to.be.false;
    });

    describe('getLogger', () => {
        it('should return a logger', () => {
            expect(Logger.getLogger()).to.be.instanceof(Logger);
        });

        it('should create a singleton and return that', () => {
            expect(Logger.getLogger()).to.equal(Logger.getLogger());
        });
    });
});
