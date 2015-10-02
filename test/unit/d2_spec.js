import fixtures from '../fixtures/fixtures.js';

describe('D2', () => {
    let proxyquire = require('proxyquire').noCallThru();
    let apiMock;
    let i18nStub;
    let I18n;
    let loggerMock = {
        error: sinon.spy(),
    };
    let loggerMockObject = {
        getLogger: () => {
            return loggerMock;
        }
    };

    //TODO: Make this mock a bit more dynamic so we can test for different ModelDefinition
    // jscs:disable
    let ModelDefinition = function ModelDefinition() {
        this.name = 'dataElement';
    };
    ModelDefinition.prototype = {};
    // jscs:enable
    let ModelDefinitionMock = {
        createFromSchema: sinon.stub().returns(new ModelDefinition()),
        prototype: {}
    };
    let d2;

    beforeEach(() => {
        ModelDefinitionMock.createFromSchema.callCount = 0;
        let apiMockClass;
        const schemasResponse = {
            schemas: [
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
            ]
        };

        apiMock = {
            get: stub(),
            setBaseUrl: spy()
        };

        apiMock.get
            .onFirstCall().returns(Promise.resolve(schemasResponse))
            .onSecondCall().returns(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
            .onThirdCall().returns(Promise.resolve({}))
            .onCall(3).returns(Promise.resolve([]))
            .onCall(4).returns(Promise.resolve('en'))
            .onCall(5).returns(new Promise(resolve => resolve(schemasResponse)))
            .onCall(6).returns(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
            .onCall(7).returns(Promise.resolve({}))
            .onCall(8).returns(Promise.resolve([]))
            .onCall(9).returns(Promise.resolve('en'));


        apiMockClass = {
            getApi: () => apiMock,
        };

        // jscs:disable
        let ModelDefinitionsMock = function ModelDefinitions() {
            this.modelsMockList = true;
        };
        // jscs:enable
        ModelDefinitionsMock.prototype = {
            add: function (schema) {
                this[schema.name] = schema;
            }
        };
        proxyquire('d2/d2', {
            'd2/model/models': {
                ModelDefinitions: ModelDefinitionsMock,
                ModelDefinition: ModelDefinitionMock
            },
            'd2/api/Api': apiMockClass,
            'd2/logger/Logger': loggerMockObject,
        });

        proxyquire('d2/i18n/I18n', {
            'd2/api/Api': apiMockClass,
        });

        I18n = require('d2/i18n/I18n');
        i18nStub = {
            addSource: stub(),
            addStrings: stub(),
            load: stub().returns(Promise.resolve()),
        };
        I18n.getI18n = stub().returns(i18nStub);

        d2 = require('d2/d2');
    });

    it('should have an init function', () => {
        expect(d2.init).to.be.a('function');
    });

    it('should have a getInstance function', () => {
        expect(d2.getInstance).to.be.a('function');
    });

    describe('init', () => {
        it('should call load on i18n instance', (done) => {
            d2.init();
            d2.getInstance()
                .then(() => {
                    expect(i18nStub.load).to.be.calledOnce;
                    done();
                })
                .catch(done);
        });
    });

    describe('config', () => {
        it('should have a default baseUrl in the config', () => {
            expect(d2.config.baseUrl).to.equal('/api');
        });

        it('should use the baseUrl from the pre-init config', (done) => {
            d2.config.baseUrl = '/dhis/api';

            d2.init();
            d2.getInstance()
                .then(d2 => {
                    expect(apiMock.setBaseUrl).to.be.calledWith('/dhis/api');
                    done();
                });
        });

        it('should let the init() config override the pre-init config', (done) => {
            d2.config.baseUrl = '/dhis/api';

            d2.init({baseUrl: '/demo/api'});
            d2.getInstance().then(d2 => {
                expect(apiMock.setBaseUrl).to.be.calledWith('/demo/api');
                done();
            });
        });

        it('should pass the sources Set as an sources array to the i18n class', (done) => {
            d2.config.i18n.sources.add('global.properties');
            d2.config.i18n.sources.add('nonglobal.properties');
            d2.config.i18n.sources.add('systemsettings.properties');

            d2.init();
            d2.getInstance()
                .then((d2) => {
                    expect(i18nStub.addSource).to.have.callCount(3);
                    done();
                })
                .catch((e) => {
                    done(e);
                });

        });

        it('should call addStrings for the pre-init added strings', (done) => {
            d2.config.i18n.strings.add('name');
            d2.config.i18n.strings.add('yes');

            d2.init();
            d2.getInstance()
                .then((d2) => {
                    expect(i18nStub.addStrings).to.be.calledWith(['name', 'yes']);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('getInstance', () => {
        it('should return a promise', () => {
            expect(d2.getInstance()).to.be.instanceof(Promise);
        });

        it('should return the d2 instance after init', (done) => {
            Promise.all([d2.init({baseUrl: '/dhis/api'}), d2.getInstance()])
                .then(([d2FromInit, d2FromFactory]) => {
                    expect(d2FromInit).to.equal(d2FromFactory);
                    done();
                })
                .catch(done);
        });

        it('should return the same instance on getInstance calls', (done) => {
            d2.init({baseUrl: '/dhis/api'})

            Promise.all([d2.getInstance(), d2.getInstance()])
                .then(([firstCallResult, secondCallResult]) => {
                    expect(firstCallResult).to.equal(secondCallResult);
                    done();
                })
                .catch(done);
        });

        it('should return a different instance after re-init', (done) => {
            d2.init();
            const instanceAfterFirstInit = d2.getInstance();

            instanceAfterFirstInit.then((first) => {
                d2.init({baseUrl: '/dhis/api'});
                const instanceAfterSecondInit = d2.getInstance();

                return Promise.all([first, instanceAfterSecondInit]);
            })
            .then(([first, second]) => {
                expect(first).not.to.equal(second);
                done();
            });
        });

        it('should return a promise when calling getInstance before init', () => {
            expect(d2.getInstance()).to.be.instanceof(Promise);
        });
    });

    it('should set the base url onto the api', () => {
        d2.init({baseUrl: '/dhis/api'});

        expect(apiMock.setBaseUrl).to.have.been.calledWith('/dhis/api');
    });

    it('should set the baseUrl to the default /api', () => {
        d2.init({});

        expect(apiMock.setBaseUrl).to.have.been.called;
    });

    it('should throw an error when the passed config is not an object', () => {
        function shouldThrowOnString() {
            d2.init(' ');
        }

        function shouldThrowOnFunction() {
            d2.init(() => {return true;});
        }

        expect(shouldThrowOnString).to.throw('Expected Config parameter to have type object');
        expect(shouldThrowOnFunction).to.throw('Expected Config parameter to have type object');
    });

    it('should not throw an error when no config is passed', () => {
        function shouldNotThrow() {
            d2.init();
        }

        expect(shouldNotThrow).to.not.throw();
    });

    it('should call the api', (done) => {
        d2.init({baseUrl: '/dhis/api'}).then(() => {
            expect(apiMock.get).to.have.been.calledWith('schemas');
            done();
        });
    });

    it('should log the error when schemas can not be requested', (done) => {
        apiMock.get.onFirstCall().returns(Promise.reject(new Error('Failed')));

        d2.init({baseUrl: '/dhis/api'})
            .catch(() => {
                expect(loggerMock.error).to.have.been.calledWith('Unable to get schemas from the api', new Error('Failed'));
                done();
            });
    });

    it('should return an object with the api object', () => {
        d2.init({baseUrl: '/dhis/api'})
            .then(function (d2) {
                expect(d2.Api.getApi()).to.equal(apiMock);
            });
    });

    it('should call the api for all startup calls', (done) => {
        d2.init({baseUrl: '/dhis/api'})
            .then(() => {
                expect(apiMock.get).to.be.callCount(5);
                done();
            })
            .catch(done);
    });

    it('should query the api for all the attributes', (done) => {
        d2.init({baseUrl: '/dhis/api'})
            .then(() => {
                let attributeCall = apiMock.get.getCall(1);
                /* 0: Url, 1: Data, 1: Query params, 2: Request options */
                expect(attributeCall.args[0]).to.equal('attributes');
                expect(attributeCall.args[1]).to.deep.equal({fields: ':all,optionSet[:all]', paging: false});
                done();
            });
    });

    describe('creation of ModelDefinitions', () => {
        it('should add the model definitions object to the d2 object', (done) => {
            d2.init()
                .then(function (d2) {
                    expect(d2.models).to.not.be.undefined;
                    expect(d2.models.modelsMockList).to.equal(true);
                    done();
                });
        });

        it('should create a ModelDefinition for each of the schemas', (done) => {
            d2.init()
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).to.have.been.called;
                    expect(ModelDefinitionMock.createFromSchema.callCount).to.equal(3);
                    done();
                });

        });

        it('should call the ModelDefinition.createFromSchema with the schema', (done) => {
            d2.init()
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).to.have.been.calledWith(fixtures.get('/api/schemas/dataElement'), fixtures.get('dataElementAttributes'));
                    done();
                });
        });

        it('should add the ModelDefinitions to the models list', (done) => {
            d2.init()
                .then(function (d2) {
                    expect(d2.models.dataElement).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('currentUser', () => {
        it('should be available on the d2 object', (done) => {
            d2.init();
            d2.getInstance()
                .then(d2 => {
                    expect(d2.currentUser).to.not.be.undefined;
                    done();
                })
                .catch(done);
        });
    });
});
