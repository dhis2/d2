describe('D2', function () {
    /* Require the promise shim here too as we use the Promise object before
     * we require d2/d2. We have to do it this way as the jqueryMock needs to return a promise.
     */
    require('when/es6-shim/Promise.browserify-es6');

    var proxyquire = require('proxyquire').noCallThru();
    var fixtures = require('fixtures/fixtures');
    var apiMock;
    var loggerMock = {
        error: jasmine.createSpy('error')
    };
    var loggerMockObject = {
        getLogger: function () {
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
        createFromSchema: jasmine.createSpy('ModelDefinition.createFromSchema')
            .and.returnValue(new ModelDefinition())
    };

    var d2;

    beforeEach(function () {
        var apiMockClass;
        apiMock = {
            get: jasmine.createSpy('ajax')
                .and.returnValue(Promise.resolve({
                    //TODO: Should change these to be different ones
                    schemas: [
                        fixtures.get('/api/schemas/dataElement'),
                        fixtures.get('/api/schemas/dataElement'),
                        fixtures.get('/api/schemas/dataElement')
                    ]})),
            setBaseUrl: jasmine.createSpy('setBaseUrl')
        };

        apiMockClass = {
            getApi: function () {
                return apiMock;
            }
        };

        loggerMock.error.calls.reset();
        ModelDefinitionMock.createFromSchema.calls.reset();

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
            'd2/model': {
                ModelDefinitions: ModelDefinitionsMock,
                ModelDefinition: ModelDefinitionMock
            },
            'd2/api/Api': apiMockClass,
            'd2/logger/Logger': loggerMockObject
        });

        d2 = require('d2/d2');
    });

    it('should be an object', function () {
        expect(d2).toBeDefined();
    });

    it('should be a function', function () {
        expect(d2).toEqual(jasmine.any(Function));
    });

    it('should set the base url onto the api', function () {
        d2({baseUrl: '/dhis/api'});

        expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
    });

    it('should set the baseUrl to the default /api', function () {
        d2({});

        expect(apiMock.setBaseUrl).not.toHaveBeenCalled();
    });

    it('should throw an error when the passed config is not an object', function () {
        function shouldThrowOnString() {
            d2(' ');
        }

        function shouldThrowOnFunction() {
            d2(function () {});
        }

        expect(shouldThrowOnString).toThrowError('Expected Config parameter to have type object');
        expect(shouldThrowOnFunction).toThrowError('Expected Config parameter to have type object');
    });

    it('should not throw an error when no config is passed', function () {
        function shouldNotThrow() {
            d2();
        }

        expect(shouldNotThrow).not.toThrow();
    });

    it('should call the api', function (done) {
        d2({baseUrl: '/dhis/api'}).then(function () {
            expect(apiMock.get).toHaveBeenCalledWith('schemas');
            done();
        });
    });

    it('should log the error when schemas can not be requested', function (done) {
        apiMock.get.and.returnValue(Promise.reject(new Error('Failed')));

        d2({baseUrl: '/dhis/api'})
            .catch(function () {
                expect(loggerMock.error).toHaveBeenCalledWith('Unable to get schemas from the api', new Error('Failed'));
                done();
            });
    });

    it('should return an object with the api object', function () {
        d2({baseUrl: '/dhis/api'})
            .then(function (d2) {
                expect(d2.Api.getApi()).toEqual(apiMock);
            });
    });

    describe('creation of ModelDefinitions', function () {
        it('should add the model definitions object to the d2 object', function (done) {
            d2()
                .then(function (d2) {
                    expect(d2.models).toBeDefined();
                    expect(d2.models.modelsMockList).toBe(true);
                    done();
                });
        });

        it('should create a ModelDefinition for each of the schemas', function (done) {
            d2()
                .then(function () {
                    expect(ModelDefinitionMock.createFromSchema).toHaveBeenCalled();
                    expect(ModelDefinitionMock.createFromSchema.calls.count()).toBe(3);
                    done();
                });

        });

        it('should call the ModelDefinition.createFromSchema with the schema', function (done) {
            d2()
                .then(function () {
                    expect(ModelDefinitionMock.createFromSchema).toHaveBeenCalledWith(fixtures.get('/api/schemas/dataElement'));
                    done();
                });
        });

        it('should add the ModelDefinitions to the models list', function (done) {
            d2()
                .then(function (d2) {
                    expect(d2.models.dataElement).toBeDefined();
                    done();
                });
        });
    });
});
