import Config from '../config'

describe('Config', () => {
    let mockD2
    let mockApi

    beforeEach(() => {
        mockApi = {
            setBaseUrl: jest.fn(),
            setUnauthorizedCallback: jest.fn(),
            setDefaultHeaders: jest.fn(),
        }
        mockD2 = {
            model: {
                ModelDefinition: function ModelDefinition() {},
                ModelDefinitions: {
                    getModelDefinitions: jest.fn(),
                },
            },
            Api: {
                getApi: jest.fn().mockReturnValue(mockApi),
            },
        }
    })

    it('should not be allowed to call as function', () => {
        expect(() => Config()).toThrowError()
    })

    describe('processConfigForD2', () => {
        it('should set the baseUrl on the api object', () => {
            Config.processConfigForD2({ baseUrl: '/api/dhis2' }, mockD2)

            expect(mockApi.setBaseUrl).toBeCalledWith('/api/dhis2')
        })

        it('should call setBaseUrl with the default api location', () => {
            Config.processConfigForD2({}, mockD2)

            expect(mockApi.setBaseUrl).toBeCalledWith('/api')
        })

        it('should set the unauthorized function if provided', () => {
            const unauthorizedCb = () => {}
            Config.processConfigForD2({ unauthorizedCb }, mockD2)
            expect(mockApi.setUnauthorizedCallback).toBeCalledWith(
                unauthorizedCb
            )
        })
    })

    describe('processPreInitConfig', () => {
        it('should set headers', () => {
            const headers = { 'x-requested-with': 'XMLHttpRequest' }
            Config.processPreInitConfig({ headers }, mockApi)
            expect(mockApi.setDefaultHeaders).toBeCalledWith(headers)
        })

        it('should set baseurl', () => {
            Config.processPreInitConfig({ baseUrl: '/api/dhis2' }, mockApi)
            expect(mockApi.setBaseUrl).toBeCalledWith('/api/dhis2')
        })
    })
})
