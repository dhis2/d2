import Api from '../api/Api';
import fixtures from '../__fixtures__/fixtures';
import I18n from '../i18n/I18n';
import DataStore from '../datastore/DataStore';
import Logger from '../logger/Logger';

jest.mock('../logger/Logger');
jest.mock('../api/Api');
jest.mock('../i18n/I18n');

describe('D2', () => {
    const ModelDefinition = function ModelDefinition() {
        this.name = 'dataElement';
    };

    ModelDefinition.prototype = {};

    const ModelDefinitionMock = {
        createFromSchema: jest.fn().mockReturnValue(new ModelDefinition()),
        prototype: {},
    };
    let d2;
    let apiMock;
    let loggerMock;
    let i18nMock;

    beforeEach(() => {
        ModelDefinitionMock.createFromSchema.callCount = 0;
        const schemasResponse = {
            schemas: [
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
            ],
        };

        apiMock = {
            get: jest.fn()
                // First init round
                .mockReturnValueOnce(Promise.resolve(schemasResponse))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
                .mockReturnValueOnce(Promise.resolve({}))
                .mockReturnValueOnce(Promise.resolve([]))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/userSettings'))))
                .mockReturnValueOnce(Promise.resolve({ version: '2.21' }))
                .mockReturnValueOnce(Promise.resolve({ apps: [] }))

                // Second init round
                .mockReturnValueOnce(new Promise(resolve => resolve(schemasResponse)))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
                .mockReturnValueOnce(Promise.resolve({}))
                .mockReturnValueOnce(Promise.resolve([]))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/userSettings'))))
                .mockReturnValueOnce(Promise.resolve({ version: '2.21' }))
                .mockReturnValueOnce(Promise.resolve({ apps: [] })),
            setBaseUrl: jest.fn(),
            getApi() {
                return this;
            },
            setDefaultHeaders: jest.fn(),
        };

        loggerMock = {
            error: jest.fn(),
        };

        i18nMock = {
            addSource: jest.fn(),
            addStrings: jest.fn(),
            load: jest.fn()
                .mockReturnValue(Promise.resolve()),
        };

        Logger.getLogger = Logger.getLogger.mockReturnValue(loggerMock);
        Api.getApi = Api.getApi.mockReturnValue(apiMock);
        I18n.getI18n = I18n.getI18n.mockReturnValue(i18nMock);

        // jscs:disable
        const ModelDefinitionsMock = function ModelDefinitions() {
            this.modelsMockList = true;
            this.add = function add(schema) {
                this[schema.name] = schema;
            };
        };
        // jscs:enable
        ModelDefinitionsMock.prototype = {
            add(schema) {
                this[schema.name] = schema;
            },
        };
        ModelDefinitionsMock.getModelDefinitions = jest.fn().mockReturnValue(new ModelDefinitionsMock());

        // Import after we have set all the mock values
        // TODO: should probably use jest.mock and use a regular ES6 import
        d2 = require('../d2'); // eslint-disable-line global-require
    });

    afterEach(() => {

    });

    it('should have an init function', () => {
        expect(typeof d2.init).toBe('function');
    });

    it('should have a getInstance function', () => {
        expect(typeof d2.getInstance).toBe('function');
    });

    describe('init', () => {
        it('should call load on i18n instance', () => {
            expect.assertions(1);

            d2.init(undefined, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(i18nMock.load).toHaveBeenCalledTimes(1);
                });
        });
    });

    describe('config', () => {
        it('should have a default baseUrl in the config', () => {
            expect(d2.config.baseUrl).toBe('/api');
        });

        it('should use the baseUrl from the pre-init config', () => {
            d2.config.baseUrl = '/dhis/api';

            expect.assertions(1);

            d2.init(undefined, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
                });
        });

        it('should let the init() config override the pre-init config', () => {
            d2.config.baseUrl = '/dhis/api';

            expect.assertions(1);

            d2.init({ baseUrl: '/demo/api' }, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/demo/api');
                });
        });

        it('should use default headers for requests', () => {
            d2.config.baseUrl = '/dhis/api';
            d2.config.headers = {
                Authorization: Buffer.from('admin:district').toString('base64'),
            };

            expect.assertions(1);

            d2.init({ baseUrl: '/demo/api' }, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(apiMock.setDefaultHeaders).toHaveBeenCalledWith({ Authorization: 'YWRtaW46ZGlzdHJpY3Q=' });
                });
        });

        it('should pass the sources Set as an sources array to the i18n class', () => {
            d2.config.i18n.sources.add('global.properties');
            d2.config.i18n.sources.add('nonglobal.properties');
            d2.config.i18n.sources.add('systemsettings.properties');

            expect.assertions(1);

            d2.init(undefined, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(i18nMock.addSource).toHaveBeenCalledTimes(3);
                });
        });

        it('should call addStrings for the pre-init added strings', () => {
            d2.config.i18n.strings.add('name');
            d2.config.i18n.strings.add('yes');

            expect.assertions(1);

            d2.init(undefined, apiMock);
            return d2.getInstance()
                .then(() => {
                    expect(i18nMock.addStrings).toHaveBeenCalledWith(['name', 'yes']);
                });
        });
    });

    describe('getInstance', () => {
        it('should return a promise', () => {
            expect(d2.getInstance()).toBeInstanceOf(Promise);
        });

        it('should return the d2 instance after init', () => {
            expect.assertions(1);

            return Promise.all([d2.init({ baseUrl: '/dhis/api' }, apiMock), d2.getInstance()])
                .then(([d2FromInit, d2FromFactory]) => {
                    expect(d2FromInit).toBe(d2FromFactory);
                });
        });

        it('should return the same instance on getInstance calls', () => {
            d2.init({ baseUrl: '/dhis/api' }, apiMock);

            expect.assertions(1);

            return Promise.all([d2.getInstance(), d2.getInstance()])
                .then(([firstCallResult, secondCallResult]) => {
                    expect(firstCallResult).toBe(secondCallResult);
                });
        });

        it('should return a different instance after re-init', () => {
            d2.init(undefined, apiMock);
            const instanceAfterFirstInit = d2.getInstance();

            expect.assertions(1);

            return instanceAfterFirstInit.then((first) => {
                d2.init({ baseUrl: '/dhis/api' }, apiMock);
                const instanceAfterSecondInit = d2.getInstance();

                return Promise.all([first, instanceAfterSecondInit]);
            })
                .then(([first, second]) => {
                    expect(first).not.toBe(second);
                });
        });

        it('should return a promise when calling getInstance before init', () => {
            expect(d2.getInstance()).toBeInstanceOf(Promise);
        });
    });

    it('should set the base url onto the api', () => {
        d2.init({ baseUrl: '/dhis/api' }, apiMock);

        expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
    });

    it('should set the baseUrl to the default /api', () => {
        d2.init({}, apiMock);

        expect(apiMock.setBaseUrl).toBeCalled();
    });

    it('should throw an error when the passed config is not an object', () => {
        function shouldThrowOnString() {
            d2.init(' ');
        }

        function shouldThrowOnFunction() {
            d2.init(() => true);
        }

        expect(shouldThrowOnString).toThrowError('Expected Config parameter to have type object');
        expect(shouldThrowOnFunction).toThrowError('Expected Config parameter to have type object');
    });

    it('should not throw an error when no config is passed', () => {
        function shouldNotThrow() {
            d2.init(undefined, apiMock);
        }

        expect(shouldNotThrow).not.toThrowError();
    });

    it('should call the api', () => d2.init({ baseUrl: '/dhis/api' }, apiMock)
        .then(() => {
            const fields = 'apiEndpoint,name,displayName,authorities,singular,plural,' +
                'shareable,metadata,klass,identifiableObject,translatable,' +
                'properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,max,' +
                'ordered,unique,constants,owner,itemPropertyType,translationKey,embeddedObject]';

            expect(apiMock.get).toHaveBeenCalledWith('schemas', { fields });
        }));

    it('should log the error when schemas can not be requested', () => {
        apiMock.get = jest.fn().mockReturnValueOnce(Promise.reject(new Error('Failed')));

        return d2.init({ baseUrl: '/dhis/api' }, apiMock, loggerMock)
            .then(
                () => Promise.reject('No error occurred'),
                () => {
                    expect(loggerMock.error).toHaveBeenCalledTimes(1);
                    expect(loggerMock.error)
                        .toHaveBeenCalledWith('Unable to get schemas from the api', '{}', new Error('Failed'));
                },
            );
    });

    it('should return an object with the api object', () => {
        expect.assertions(1);

        return d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then((newD2) => {
                expect(newD2.Api.getApi()).toBe(apiMock);
            });
    });

    it('should call the api for all startup calls', () => {
        expect.assertions(1);

        return d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then(() => {
                expect(apiMock.get).toHaveBeenCalledTimes(7);
            });
    });

    it('should query the api for all the attributes', () => {
        expect.assertions(2);

        return d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then(() => {
                const attributeCallArgs = apiMock.get.mock.calls[1];
                /* 0: Url, 1: Data, 1: Query params, 2: Request options */
                expect(attributeCallArgs[0]).toBe('attributes');
                expect(attributeCallArgs[1]).toEqual({ fields: ':all,optionSet[:all,options[:all]]', paging: false });
            });
    });

    describe('creation of ModelDefinitions', () => {
        it('should add the model definitions object to the d2 object', () => {
            expect.assertions(1);

            return d2.init(undefined, apiMock)
                .then((newD2) => {
                    expect(newD2.models).toBeDefined();
                });
        });

        it('should add the ModelDefinitions to the models list', () => {
            expect.assertions(1);

            return d2.init(undefined, apiMock)
                .then((newD2) => {
                    expect(newD2.models.dataElement).toBeDefined();
                });
        });
    });

    describe('currentUser', () => {
        it('should be available on the d2 object', () => {
            d2.init(undefined, apiMock);
            expect.assertions(1);

            return d2.getInstance()
                .then((newD2) => {
                    expect(newD2.currentUser).toBeDefined();
                });
        });
    });

    describe('with specific schema loading', () => {
        it('should have only loaded a single schema', () => {
            apiMock.get
                // First init round
                .mockReturnValueOnce(Promise.resolve(fixtures.get('/api/schemas/user')));
            d2.init({
                schemas: ['user'],
            }, apiMock);

            expect.assertions(1);

            return d2.getInstance()
                .then(() => {
                    expect(apiMock.get).toHaveBeenCalledWith('schemas/user', {
                        fields: 'apiEndpoint,name,displayName,authorities,singular,plural,shareable,metadata,klass,' +
                        'identifiableObject,translatable,' +
                        'properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,' +
                        'max,ordered,unique,constants,owner,itemPropertyType,translationKey,embeddedObject]',
                    });
                });
        });
    });

    describe('DataStore', () => {
        it('should have a dataStore object on the instance', () => {
            expect.assertions(1);

            return d2.init(undefined, apiMock)
                .then((d2Instance) => {
                    expect(d2Instance.dataStore).toBeInstanceOf(DataStore);
                });
        });
    });

    describe('getUserSettings', () => {
        it('should be a function', () => {
            expect(typeof d2.getUserSettings).toBe('function');
        });

        it('should return an object with the uiLocale', () => {
            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(fixtures.get('/api/userSettings')));

            expect.assertions(1);

            return d2.getUserSettings(apiMock)
                .then((settings) => {
                    expect(settings.keyUiLocale).toBe('fr');
                });
        });

        it('should call the api for keyUiLocale', () => {
            d2.getUserSettings(apiMock);

            expect(apiMock.get).toBeCalled();
        });

        it('should use the default base url when the set baseUrl is not valid', () => {
            d2.config.baseUrl = undefined;

            expect.assertions(2);

            return d2.getUserSettings(apiMock)
                .then(() => {
                    expect(apiMock.setBaseUrl).not.toBeCalled();
                    expect(apiMock.get).toHaveBeenCalledWith('userSettings');
                });
        });
    });

    describe('getManifest', () => {
        it('should be a function', () => {
            expect(typeof d2.getManifest).toBe('function');
        });

        it('should return a promise', () => {
            expect(d2.getManifest('manifest.webapp', apiMock)).toBeInstanceOf(Promise);
        });

        it('should request the manifest.webapp', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve({}));

            expect.assertions(1);

            return d2.getManifest('manifest.webapp', apiMock)
                .then(() => {
                    expect(apiMock.get).toHaveBeenCalledWith('manifest.webapp');
                });
        });

        it('should return the manifest.webapp object', () => {
            const expectedManifest = {
                name: 'MyApp',
            };

            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(expectedManifest));

            expect.assertions(1);

            return d2.getManifest('manifest.webapp', apiMock)
                .then((manifest) => {
                    expect(manifest.name).toBe(expectedManifest.name);
                });
        });

        it('should add the getBaseUrl convenience method', () => {
            const expectedManifest = {
                name: 'MyApp',
                activities: {
                    dhis: {
                        href: 'http://localhost:8080',
                    },
                },
            };

            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(expectedManifest));

            expect.assertions(1);

            return d2.getManifest('manifest.webapp', apiMock)
                .then((manifest) => {
                    expect(manifest.getBaseUrl()).toBe('http://localhost:8080');
                });
        });
    });
});
