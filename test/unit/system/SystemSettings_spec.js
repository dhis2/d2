describe('settings.System', () => {
    'use strict';

    let Api = require('../../../src/api/Api');
    let SystemSettings = require('../../../src/system/SystemSettings');
    let systemSettings;

    beforeEach(() => {
        systemSettings = new SystemSettings();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemSettings()).to.throw('Cannot call a class as a function'); //jshint ignore:line
    });

    it('should set an instance of Api onto the SystemSettings instance', () => {
        expect(systemSettings.api).to.be.instanceof(Api);
    });

    describe('all', () => {
        beforeEach(() => {
            systemSettings.api.get = sinon.stub().returns(Promise.resolve({keyLastSuccessfulResourceTablesUpdate: 'Tue Mar 10 12:24:00 CET 2015'}));
        });

        it('should be a function', () => {
            expect(systemSettings.all).to.be.instanceof(Function);
        });

        it('should call the api to get all the systemSettings', () => {
            systemSettings.all();

            expect(systemSettings.api.get).to.be.calledWith('systemSettings');
        });

        it('should resolve the promise with the settings', (done) => {
            systemSettings.all()
                .then(settings => {
                    expect(settings.keyLastSuccessfulResourceTablesUpdate).to.equal('Tue Mar 10 12:24:00 CET 2015');
                })
                .then(done);
        });
    });

    describe('get', () => {
        beforeEach(() => {
            systemSettings.api.get = sinon.stub().returns(Promise.resolve('Tue Mar 10 12:24:00 CET 2015'));
        });

        it('should be a function', () => {
            expect(systemSettings.get).to.be.instanceof(Function);
        });

        it('should return a Promise', () => {
            let result = systemSettings.get('keyLastSuccessfulResourceTablesUpdate');

            expect(result).to.be.instanceof(Promise);
        });

        it('should reject the promise with an error if no key has been specified', (done) => {
            systemSettings.get()
                .catch(error => {
                    expect(error).to.be.instanceof(TypeError);
                    expect(error.message).to.equal('A "key" parameter should be specified when calling get() on systemSettings');
                })
                .then(done);
        });

        it('should call the api to get the value', () => {
            systemSettings.get('keyLastSuccessfulResourceTablesUpdate');

            expect(systemSettings.api.get).to.be.calledWith('systemSettings/keyLastSuccessfulResourceTablesUpdate', undefined, {dataType: 'text'});
        });

        it('should return the value from the promise', (done) => {
            systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then((value) => {
                    expect(value).to.equal('Tue Mar 10 12:24:00 CET 2015');
                })
                .then(done);
        });

        it('should try to transform the response to json if possible', (done) => {
            systemSettings.api.get = sinon.stub().returns(Promise.resolve('{"mydataKey": "myDataValue"}'));

            systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then((value) => {
                    expect(value).to.deep.equal({mydataKey: 'myDataValue'});
                })
                .then(done);
        });

        it('should reject the promise if the value is empty', (done) => {
            systemSettings.api.get = sinon.stub().returns(Promise.resolve(''));

            systemSettings.get('keyThatDefinitelyDoesNotExist')
                .catch((error) => {
                    expect(error.message).to.equal('The requested systemSetting has no value or does not exist.');
                })
                .then(done);
        });
    });
});
