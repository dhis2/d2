import MockApi from '../../api/Api';
import AnalyticsBase from '../AnalyticsBase';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

let base;

describe('constructor', () => {
    beforeEach(() => {
        base = new AnalyticsBase(new MockApi());
        base.api.get = jest.fn(() => Promise.resolve('OK'));
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsBase()).toThrowErrorMatchingSnapshot();
    });

    it('should add the mockApi onto the AnalyticsBase instance', () => {
        const mockApi = MockApi.getApi();
        MockApi.mockClear();

        expect(base.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        base = new AnalyticsBase(apiMockObject);

        expect(base.api).toBe(apiMockObject);
    });

    it('should respect includeNumDen property of the request object', () => {
        const mockReq = {
            parameters: {
                includeNumDen: false,
            },
        };
        base.get(mockReq);
        expect(base.api.get.mock.calls[0][1]).toHaveProperty('includeNumDen', false);
    });

    it('should use the default value true for includeNumDen if no value was specified', () => {
        const mockReq = {
            parameters: {},
        };
        base.get(mockReq);
        expect(base.api.get.mock.calls[0][1]).toHaveProperty('includeNumDen', true);
    });

    afterAll(() => {
        base.api.get.mockReset();
    });
});
