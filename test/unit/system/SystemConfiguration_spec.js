describe('System.configuration', () => {
    const Api = require('../../../src/api/Api');
    const SystemConfiguration = require('../../../src/system/SystemConfiguration');
    let configuration;
    let apiGet;
    let apiPost;
    let apiDelete;

    const mockConfiguration = {
        'systemId': 'eed3d451-4ff5-4193-b951-ffcc68954299',
        'feedbackRecipients': {
            'name': 'Feedback Message Recipients',
            'created': '2011-12-25T16:52:04.409+0000',
            'lastUpdated': '2015-10-19T10:27:27.636+0000',
            'externalAccess': false,
            'user': {
                'name': 'John Traore',
                'created': '2013-04-18T17:15:08.407+0000',
                'lastUpdated': '2015-09-14T20:18:28.355+0000',
                'externalAccess': false,
                'id': 'xE7jOejl9FI',
            },
            'id': 'QYrzIjSfI8z',
        },
        'offlineOrganisationUnitLevel': {
            'name': 'Chiefdom',
            'created': '2011-12-24T12:24:22.935+0000',
            'lastUpdated': '2015-08-09T12:58:05.001+0000',
            'externalAccess': false,
            'id': 'tTUf91fCytl',
        },
        'infrastructuralIndicators': {
            'name': 'Staffing',
            'created': '2013-04-18T14:36:27.000+0000',
            'lastUpdated': '2013-04-18T14:36:27.000+0000',
            'externalAccess': false,
            'publicAccess': 'rw------',
            'id': 'EdDc97EJUdd',
        },
        'infrastructuralDataElements': {
            'name': 'Population Estimates',
            'created': '2011-12-24T12:24:24.298+0000',
            'lastUpdated': '2013-03-15T16:08:56.135+0000',
            'externalAccess': false,
            'publicAccess': 'rw------',
            'id': 'sP7jTt3YGBb',
        },
        'infrastructuralPeriodType': 'Yearly',
        'selfRegistrationRole': {
            'name': 'Guest',
            'created': '2012-11-13T15:56:23.510+0000',
            'lastUpdated': '2015-01-20T11:32:40.188+0000',
            'externalAccess': false,
            'id': 'XS0dNzuZmfH',
        },
        'selfRegistrationOrgUnit': {
            'code': 'OU_525',
            'name': 'Sierra Leone',
            'created': '2012-11-13T12:20:53.028+0000',
            'lastUpdated': '2015-04-24T11:21:00.090+0000',
            'externalAccess': false,
            'user': {
                'name': 'Tom Wakiki',
                'created': '2012-11-21T12:02:04.303+0000',
                'lastUpdated': '2015-10-19T10:27:27.567+0000',
                'externalAccess': false,
                'id': 'GOLswS44mh8',
            },
            'id': 'ImspTQPwCqd',
        },
        'corsWhitelist': [
            'http://cors1.example.com',
            'https://cors2.example.com',
        ],
        'remoteServerUrl': 'https://apps.dhis2.org/demo',
        'remoteServerUsername': 'admin',
    };

    const mockCorsWhitelistText = 'http://cors1.example.com\nhttps://cors2.example.com';

    beforeEach(() => {
        configuration = new SystemConfiguration();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemConfiguration()).to.throw('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should set an instance of Api onto the SystemConfiguration instance', () => {
        expect(configuration.api).to.be.instanceof(Api);
    });

    it('all() should be a function', () => {
        expect(configuration.all).to.be.instanceOf(Function);
    });

    it('get() should be a function', () => {
        expect(configuration.get).to.be.instanceOf(Function);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        configuration = new SystemConfiguration(apiMockObject);

        expect(configuration.api).to.equal(apiMockObject);
    });

    describe('API call', () => {
        beforeEach(() => {
            configuration.api.get = apiGet = sinon.stub();
            configuration.api.post = apiPost = sinon.stub();
            configuration.api.delete = apiDelete = sinon.stub();

            apiGet.withArgs('configuration').returns(Promise.resolve(mockConfiguration));
            apiPost.returns(Promise.resolve());
            apiDelete.returns(Promise.resolve());
        });

        afterEach(() => {
            configuration = new SystemConfiguration();
        });

        describe('.all()', () => {
            it('should return the entire config', (done) => {
                configuration.all().then((res) => {
                    expect(res).to.eql(mockConfiguration);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API for all configuration endpoints', (done) => {
                configuration.all();

                expect(apiGet.callCount).to.equal(1);
                expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                done();
            });

            it('should only call the API once', (done) => {
                configuration.all().then(() => {
                    configuration.all().then(() => {
                        expect(apiGet.callCount).to.equal(1);
                        expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                        done();
                    });
                    expect(apiGet.callCount).to.equal(1);
                    expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                });
            });

            it('should call the API again if ignoreCache is true', (done) => {
                configuration.all(true).then(() => {
                    configuration.all(true).then(() => {
                        expect(apiGet.callCount).to.equal(2);
                        expect(apiGet.withArgs('configuration').callCount).to.equal(2);
                        done();
                    });
                    expect(apiGet.callCount).to.equal(1);
                    expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                });
            });
        });

        describe('.get()', () => {
            it('should return the correct systemId', (done) => {
                configuration.get('systemId').then((res) => {
                    expect(res).to.equal(mockConfiguration.systemId);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should return the correct feedback recipient user group', () => {
                configuration.get('feedbackRecipients').then((res) => {
                    expect(res).to.equal(mockConfiguration.feedbackRecipients);
                }, (err) => {
                    done(err);
                });
            });

            it('should only query the API once', (done) => {
                configuration.get('systemId').then(() => {
                    configuration.get('systemId').then((res) => {
                        expect(res).to.equal(mockConfiguration.systemId);
                        expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                        done();
                    }, (err) => {
                        done(err);
                    });
                    expect(res).to.equal(mockConfiguration.systemId);
                    expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API twice if ignoreCache is true', (done) => {
                configuration.get('systemId', true).then(() => {
                    configuration.get('systemId', true).then((res) => {
                        expect(res).to.equal(mockConfiguration.systemId);
                        expect(apiGet.withArgs('configuration').callCount).to.equal(2);
                        done();
                    }, (err) => {
                        done(err);
                    });
                    expect(res).to.equal(mockConfiguration.systemId);
                    expect(apiGet.withArgs('configuration').callCount).to.equal(1);
                }, (err) => {
                    done(err);
                });
            });

            it('should throw an error when asked for an unknown config option', (done) => {
                try {
                    configuration.get('someRandomOptionThatDoesntExist').then(() => {
                        done(new Error('No error thrown'));
                    }, () => {
                        done();
                    });
                } catch (e) {
                    done();
                }
            });
        });

        describe('.set()', () => {
            it('should not be able to change the systemId', (done) => {
                configuration.set('systemId', 'my-random-system-id')
                    .then(() => {
                        done('Attempting to change systemId didn\'t result in an error');
                    })
                    .catch(() => {
                        done();
                    });
            });

            it('should not attempt to change unknown settings', (done) => {
                configuration.set('completelyCrazyConfigurationOption', 'totally rediculous value')
                    .then(() => {
                        done();
                    }).catch(() => {
                        done('Attempting to change a configuration setting that don\'t exist should not result in a client side error');
                    });
            });

            it('should call DELETE to remove feedback recipients', (done) => {
                configuration.set('feedbackRecipients', 'null')
                    .then(() => {
                        expect(apiPost.callCount).to.equal(0);
                        expect(apiDelete.withArgs('configuration/feedbackRecipients').callCount).to.equal(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should convert CORS string to an array', (done) => {
                configuration.set('corsWhitelist', mockCorsWhitelistText)
                    .then(() => {
                        expect(apiPost.withArgs('configuration/corsWhitelist', mockConfiguration.corsWhitelist).callCount).to.equal(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should post new settings to the API', (done) => {
                configuration.set('infrastructuralPeriodType', 'Monthly')
                    .then(() => {
                        expect(apiPost.withArgs('configuration/infrastructuralPeriodType', 'Monthly').callCount).to.equal(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should reject a promise when no configuration can be found for the key', () => {
                apiPost.returns(Promise.reject('StackTrace!'));

                return configuration.set('thisKeyDoesNotExist', 'Some value')
                    .catch(message => message)
                    .then(message => {
                        expect(message).to.equal('No configuration found for thisKeyDoesNotExist');
                    });
            });
        });
    });
});
