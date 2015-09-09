import fixtures from '../fixtures/fixtures.js';

describe('D2', () => {
    var proxyquire = require('proxyquire').noCallThru();
    var apiMock;
    var loggerMock = {
        error: sinon.spy()
    };
    var loggerMockObject = {
        getLogger: () => {
            return loggerMock;
        }
    };

    //TODO: Make this mock a bit more dynamic so we can test for different ModelDefinition
    // jscs:disable
    var ModelDefinition = function ModelDefinition() {
        this.name = 'dataElement';
    };
    ModelDefinition.prototype = {};
    // jscs:enable
    var ModelDefinitionMock = {
        createFromSchema: sinon.stub().returns(new ModelDefinition()),
        prototype: {}
    };
    var d2;

    beforeEach(() => {
        ModelDefinitionMock.createFromSchema.callCount = 0;
        var apiMockClass;
        apiMock = {
            get: stub(),
            setBaseUrl: spy()
        };

        apiMock.get.onFirstCall().returns(new Promise(function (resolve) {
            resolve({
                schemas: [
                    fixtures.get('/api/schemas/dataElement'),
                    fixtures.get('/api/schemas/dataElement'),
                    fixtures.get('/api/schemas/dataElement')
                ]
            });
        }));

        apiMock.get.onSecondCall().returns(new Promise((resolve) => {
            resolve(fixtures.get('/api/attributes'));
        }));

        apiMockClass = {
            getApi: () => {
                return apiMock;
            }
        };

        // jscs:disable
        var ModelDefinitionsMock = function ModelDefinitions() {
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
            'd2/logger/Logger': loggerMockObject
        });

        d2 = require('d2/d2');
    });

    it('should be a function', () => {
        expect(d2).to.be.a('function');
    });

    it('should set the base url onto the api', () => {
        d2({baseUrl: '/dhis/api'});

        expect(apiMock.setBaseUrl).to.have.been.calledWith('/dhis/api');
    });

    it('should set the baseUrl to the default /api', () => {
        d2({});

        expect(apiMock.setBaseUrl).to.have.been.called;
    });

    it('should throw an error when the passed config is not an object', () => {
        function shouldThrowOnString() {
            d2(' ');
        }

        function shouldThrowOnFunction() {
            d2(() => {return true;});
        }

        expect(shouldThrowOnString).to.throw('Expected Config parameter to have type object');
        expect(shouldThrowOnFunction).to.throw('Expected Config parameter to have type object');
    });

    it('should not throw an error when no config is passed', () => {
        function shouldNotThrow() {
            d2();
        }

        expect(shouldNotThrow).to.not.throw();
    });

    it('should call the api', (done) => {
        d2({baseUrl: '/dhis/api'}).then(() => {
            expect(apiMock.get).to.have.been.calledWith('schemas');
            done();
        });
    });

    it('should log the error when schemas can not be requested', (done) => {
        apiMock.get.onFirstCall().returns(Promise.reject(new Error('Failed')));

        d2({baseUrl: '/dhis/api'})
            .catch(() => {
                expect(loggerMock.error).to.have.been.calledWith('Unable to get schemas from the api', new Error('Failed'));
                done();
            });
    });

    it('should return an object with the api object', () => {
        d2({baseUrl: '/dhis/api'})
            .then(function (d2) {
                expect(d2.Api.getApi()).to.equal(apiMock);
            });
    });

    it('should call the api for all startup calls', (done) => {
        d2({baseUrl: '/dhis/api'})
            .then(() => {
                expect(apiMock.get).to.be.calledTwice;
                done();
            });

    });

    it('should query the api for all the attributes', (done) => {
        d2({baseUrl: '/dhis/api'})
            .then(() => {
                var attributeCall = apiMock.get.getCall(1);
                /* 0: Url, 1: Data, 1: Query params, 2: Request options */
                expect(attributeCall.args[0]).to.equal('attributes');
                expect(attributeCall.args[1]).to.deep.equal({fields: ':all,optionSet[:all]', paging: false});
                done();
            });
    });

    describe('creation of ModelDefinitions', () => {
        it('should add the model definitions object to the d2 object', (done) => {
            d2()
                .then(function (d2) {
                    expect(d2.models).to.not.be.undefined;
                    expect(d2.models.modelsMockList).to.equal(true);
                    done();
                });
        });

        it('should create a ModelDefinition for each of the schemas', (done) => {
            d2()
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).to.have.been.called;
                    expect(ModelDefinitionMock.createFromSchema.callCount).to.equal(3);
                    done();
                });

        });

        it('should call the ModelDefinition.createFromSchema with the schema', (done) => {
            d2()
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).to.have.been.calledWith(fixtures.get('/api/schemas/dataElement'), fixtures.get('dataElementAttributes'));
                    done();
                });
        });

        it('should add the ModelDefinitions to the models list', (done) => {
            d2()
                .then(function (d2) {
                    expect(d2.models.dataElement).to.not.be.undefined;
                    done();
                });
        });
    });
});
