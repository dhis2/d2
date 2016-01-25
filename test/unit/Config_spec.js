import Config from '../../src/config';

describe('Config', () => {
    it('should not be allowed to call as function', () => {
        expect(() => Config()).to.throw();  // eslint-disable-line
    });

    describe('processConfigForD2', () => {
        let mockConfig;
        let mockD2;
        let mockApi;

        beforeEach(() => {
            mockConfig = {};
            mockApi = {
                setBaseUrl: spy(),
            };
            mockD2 = {
                model: {
                    ModelDefinition: function ModelDefinition() {},
                    ModelDefinitions: {
                        getModelDefinitions: spy(),
                    },
                },
                Api: {
                    getApi: stub().returns(mockApi),
                },
            };
        });

        it('should set the baseUrl on the api object', () => {
            Config.processConfigForD2({baseUrl: '/api/dhis2'}, mockD2);

            expect(mockApi.setBaseUrl).to.be.calledWith('/api/dhis2');
        });

        it('should call setBaseUrl with the default api location', () => {
            Config.processConfigForD2({}, mockD2);

            expect(mockApi.setBaseUrl).to.be.calledWith('/api');
        });
    });
});
