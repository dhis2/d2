import MockApi from '../../api/Api';
import AnalyticsAggregate from '../AnalyticsAggregate';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

describe('Analytics.aggregate', () => {
    let aggregate;
    let mockApi;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        aggregate = new AnalyticsAggregate();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsAggregate()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the AnalyticsAggregate instance', () => {
        expect(aggregate.api).toBe(mockApi);
    });

    it('.getDataValueSet() should be a function', () => {
        expect(aggregate.getDataValueSet).toBeInstanceOf(Function);
    });

    it('.geRawData() should be a function', () => {
        expect(aggregate.getRawData).toBeInstanceOf(Function);
    });

    it('.getDebugSql() should be a function', () => {
        expect(aggregate.getDebugSql).toBeInstanceOf(Function);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        aggregate = new AnalyticsAggregate(apiMockObject);

        expect(aggregate.api).toBe(apiMockObject);
    });
});
