import MockApi from '../../api/Api';
import AnalyticsBase from '../AnalyticsBase';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

let base;

describe('constructor', () => {
    beforeEach(() => {
        base = new AnalyticsBase(new MockApi());
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsBase()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
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

    it('should initialize properties', () => {
        expect(base.query).toEqual({});
        expect(base.dimensions).toEqual([]);
        expect(base.filters).toEqual([]);
    });

    it('should have a default endpoint value', () => {
        expect(base.endPoint).toEqual('analytics');
    });

    it('should set the endpoint when passed as argument', () => {
        base = new AnalyticsBase(new MockApi(), 'analytics2');

        expect(base.endPoint).toEqual('analytics2');
    });
});

describe('.buildUrl()', () => {
    beforeEach(() => {
        base = new AnalyticsBase();
        base.addDimension('ou:ImspTQPwCqd');
    });

    it('should return the endpoint when no path is passed', () => {
        expect(base.buildUrl()).toEqual('analytics?dimension=ou:ImspTQPwCqd');
    });

    it('should append the path to the endpoint', () => {
        expect(base.buildUrl('test')).toEqual('analytics/test?dimension=ou:ImspTQPwCqd');
    });
});

describe('.buildQuery()', () => {
    beforeEach(() => {
        base = new AnalyticsBase();
    });

    it('should return an empty object when there are no filters nor parameters', () => {
        expect(base.buildQuery()).toEqual({});
    });

    it('should return an object when a filter is added', () => {
        base.addFilter('ou:ImspTQPwCqd');

        expect(base.buildQuery()).toEqual({ filter: ['ou:ImspTQPwCqd'] });
    });

    it('should return an object when a parameter is added', () => {
        base.addParameters({ page: 1 });

        expect(base.buildQuery()).toEqual({ page: 1 });
    });

    it('should return an object when parameters and filters are added', () => {
        base.addFilter('ou:ImspTQPwCqd')
            .addParameters({ page: 1 });

        expect(base.buildQuery()).toEqual({ page: 1, filter: ['ou:ImspTQPwCqd'] });
    });
});
