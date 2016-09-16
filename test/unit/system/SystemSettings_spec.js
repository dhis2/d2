describe('SystemSettings', () => {
    const Api = require('../../../src/api/Api');
    const SystemSettings = require('../../../src/system/SystemSettings');
    let systemSettings;
    let apiGet;
    let apiPost;
    let apiDelete;

    beforeEach(() => {
        systemSettings = new SystemSettings();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemSettings()).to.throw('Cannot call a class as a function'); // eslint-disable-line
    });

    it('should set an instance of Api onto the SystemSettings instance', () => {
        expect(systemSettings.api).to.be.instanceof(Api);
    });

    describe('all', () => {
        beforeEach(() => {
            systemSettings.api.get = apiGet = sinon.stub().returns(Promise.resolve({ keyLastSuccessfulResourceTablesUpdate: 'Tue Mar 10 12:24:00 CET 2015' }));
        });

        it('should be a function', () => {
            expect(systemSettings.all).to.be.instanceof(Function);
        });

        it('should call the api to get all the systemSettings', (done) => {
            systemSettings.all().then(() => {
                expect(apiGet.withArgs('systemSettings').callCount).to.equal(1);
                done();
            });
        });

        it('should resolve the promise with the settings', (done) => {
            systemSettings.all()
                .then(settings => {
                    expect(settings.keyLastSuccessfulResourceTablesUpdate).to.equal('Tue Mar 10 12:24:00 CET 2015');
                    done();
                });
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
            const result = systemSettings.get('keyLastSuccessfulResourceTablesUpdate');

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

            expect(systemSettings.api.get).to.be.calledWith('systemSettings/keyLastSuccessfulResourceTablesUpdate');
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
                    expect(value).to.deep.equal({ mydataKey: 'myDataValue' });
                })
                .then(done);
        });

        it('should reject the promise if the value is empty', (done) => {
            systemSettings.api.get = sinon.stub().returns(Promise.resolve(''));

            systemSettings.get('keyThatDefinitelyDoesNotExist')
                .then(() => {
                    done(new Error('Promise resolved'));
                })
                .catch((error) => {
                    expect(error.message).to.equal('The requested systemSetting has no value or does not exist.');
                    done();
                });
        });
    });

    describe('.set', () => {
        beforeEach(() => {
            systemSettings.api.get = apiGet = sinon.stub();
            systemSettings.api.post = apiPost = sinon.stub();
            systemSettings.api.delete = apiDelete = sinon.stub();

            apiGet.withArgs('configuration').returns(Promise.resolve());
            apiPost.returns(Promise.resolve());
            apiDelete.returns(Promise.resolve());
        });

        afterEach(() => {
            systemSettings = new SystemSettings();
        });

        it('should POST to the API', (done) => {
            systemSettings.set('mySetting', 'my value')
                .then(() => {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(1);
                    expect(apiDelete.callCount).to.equal(0);
                    done();
                })
                .catch(err => {
                    done(new Error(err));
                });
        });

        it('should DELETE if the value is null or an empty string', (done) => {
            systemSettings.set('mySetting', '')
                .then(() => {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(0);
                    expect(apiDelete.callCount).to.equal(1);
                    done();
                })
                .catch(err => {
                    done(new Error(err));
                });
        });

        it('should not alter the value', (done) => {
            const value = { type: 'object', value: 'some value' };
            systemSettings.set('mySetting', value)
                .then(() => {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(1);
                    expect(apiDelete.callCount).to.equal(0);

                    expect(apiPost).to.be.calledWith('systemSettings/mySetting', value);
                    done();
                })
                .catch(err => {
                    done(new Error(err));
                });
        });

        it('should add a "Content-Type: text/plain" header to the request', done => {
            const value = 'test';
            systemSettings.set('mySetting', value)
                .then(() => {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(1);
                    expect(apiDelete.callCount).to.equal(0);

                    expect(apiPost).to.be.calledWith('systemSettings/mySetting', value, { headers: { 'Content-Type': 'text/plain' }});
                    done();
                })
                .catch(err => {
                    done(new Error(err));
                });
        })
    });
});
