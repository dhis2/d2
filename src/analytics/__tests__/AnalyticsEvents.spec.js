import MockApi from '../../api/Api';
import AnalyticsEvents from '../AnalyticsEvents';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

describe('Analytics.events', () => {
    let events;
    let mockApi;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        events = new AnalyticsEvents();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsEvents()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the Analyticsevents instance', () => {
        expect(events.api).toBe(mockApi);
    });

    it('.setProgram() should be a function', () => {
        expect(events.setProgram).toBeInstanceOf(Function);
    });

    it('.getAggregate() should be a function', () => {
        expect(events.getAggregate).toBeInstanceOf(Function);
    });

    it('.getCount() should be a function', () => {
        expect(events.getCount).toBeInstanceOf(Function);
    });

    it('.getCluster() should be a function', () => {
        expect(events.getCluster).toBeInstanceOf(Function);
    });

    it('.getQuery() should be a function', () => {
        expect(events.getQuery).toBeInstanceOf(Function);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        events = new AnalyticsEvents('program-test', apiMockObject);

        expect(events.api).toBe(apiMockObject);
    });
});
