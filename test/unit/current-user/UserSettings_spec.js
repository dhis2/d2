describe('userSettings.CurrentUser', () => {
    const Api = require('../../../src/api/Api');
    const UserSettings = require('../../../src/current-user/UserSettings');
    const userSettingsFixture = { keyUiLocale: 'en' };
    let userSettings;
    let apiGet;
    let apiPost;
    let apiDelete;

    beforeEach(() => {
        userSettings = new UserSettings();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => UserSettings()).to.throw('Cannot call a class as a function'); // eslint-disable-line
    });

    it('should set an instance of Api onto the UserSettings instance', () => {
        expect(userSettings.api).to.be.instanceof(Api);
    });

    describe('all', () => {
        beforeEach(() => {
            userSettings.api.get = apiGet = sinon.stub().returns(Promise.resolve(userSettingsFixture));
        });

        it('should be a function', () => {
            expect(userSettings.all).to.be.instanceof(Function);
        });

        it('should call the api to get all the userSettings', (done) => {
            userSettings.all().then(() => {
                expect(apiGet.withArgs('userSettings').callCount).to.equal(1);
                done();
            });
        });

        it('should resolve the promise with the settings', (done) => {
            userSettings.all()
                .then(settings => {
                    expect(settings.keyUiLocale).to.equal('en');
                    done();
                });
        });

        it('should cache the current user settings', done => {
            userSettings.all().then(() => userSettings.all())
                .then(() => {
                    expect(apiGet.callCount).to.equal(1);
                    expect(userSettings._settings).to.deep.equal(userSettingsFixture);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('get', () => {
        beforeEach(() => {
            userSettings.api.get = apiGet = sinon.stub().returns(Promise.resolve(userSettingsFixture.keyUiLocale));
        });

        it('should be a function', () => {
            expect(userSettings.get).to.be.instanceof(Function);
        });

        it('should return a Promise', () => {
            const result = userSettings.get('keyUiLocale');

            expect(result).to.be.instanceof(Promise);
        });

        it('should reject the promise with an error if no key has been specified', (done) => {
            userSettings.get()
                .catch(error => {
                    expect(error).to.be.instanceof(TypeError);
                    expect(error.message).to.equal('A "key" parameter should be specified when calling get() on userSettings');
                })
                .then(done);
        });

        it('should call the api to get the value', () => {
            userSettings.get('keyUiLocale');

            expect(userSettings.api.get).to.be.calledWith('userSettings/keyUiLocale');
        });

        it('should return the value from the promise', (done) => {
            userSettings.get('keyUiLocale')
                .then((value) => {
                    expect(value).to.equal('en');
                })
                .then(done);
        });

        it('should try to transform the response to json if possible', (done) => {
            userSettings.api.get = sinon.stub().returns(Promise.resolve('{"mydataKey": "myDataValue"}'));

            userSettings.get('keyUiLocale')
                .then((value) => {
                    expect(value).to.deep.equal({ mydataKey: 'myDataValue' });
                })
                .then(done);
        });

        it('should reject the promise if the value is empty', (done) => {
            userSettings.api.get = sinon.stub().returns(Promise.resolve(''));

            userSettings.get('keyThatDefinitelyDoesNotExist')
                .then(() => {
                    done(new Error('Promise resolved'));
                })
                .catch((error) => {
                    expect(error.message).to.equal('The requested userSetting has no value or does not exist.');
                    done();
                });
        });

        it('should use the cache', done => {
            apiGet.returns(Promise.resolve(userSettingsFixture));

            userSettings.all().then(() => userSettings.get('keyUiLocale'))
                .then(value => {
                    expect(apiGet.callCount).to.equal(1);
                    expect(value).to.equal(userSettingsFixture.keyUiLocale);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('set', () => {
        beforeEach(() => {
            userSettings.api.get = apiGet = sinon.stub();
            userSettings.api.post = apiPost = sinon.stub();
            userSettings.api.delete = apiDelete = sinon.stub();

            apiGet.returns(Promise.resolve(userSettingsFixture));
            apiGet.withArgs('configuration').returns(Promise.resolve());
            apiPost.returns(Promise.resolve());
            apiDelete.returns(Promise.resolve());
        });

        afterEach(() => {
            userSettings = new UserSettings();
        });

        it('should POST to the API', (done) => {
            userSettings.set('mySetting', 'my value')
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
            userSettings.set('mySetting', '')
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

        it('should clear out the cache', done => {
            userSettings.all()
                .then(() => userSettings.all())
                .then(() => userSettings.set('a', 'b'))
                .then(() => userSettings.all())
                .then(() => userSettings.all())
                .then(value => {
                    expect(apiPost.callCount).to.equal(1);
                    expect(apiGet.callCount).to.equal(2);
                    done();
                })
                .catch(err => done(err));
        })
    });
});
