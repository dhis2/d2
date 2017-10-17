import Analytics from '../Analytics';
import AnalyticsAggregate from '../AnalyticsAggregate';
import AnalyticsEvents from '../AnalyticsEvents';

describe('Analytics', () => {
    let analytics;

    beforeEach(() => {
        analytics = new Analytics(new AnalyticsAggregate(), new AnalyticsEvents());
    });

    it('should create an instance of Analytics', () => {
        expect(Analytics.getAnalytics()).toBeInstanceOf(Analytics);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Analytics()).toThrowError('Cannot call a class as a function');
    });

    it('should contain an instance of AnalyticsAggregate', () => {
        expect(analytics.aggregate).toBeInstanceOf(AnalyticsAggregate);
    });

    it('should contain an instance of AnalyticsEvents', () => {
        expect(analytics.events).toBeInstanceOf(AnalyticsEvents);
    });

    describe('getAnalytics', () => {
        it('should return the same instance on consecutive requests', () => {
            expect(Analytics.getAnalytics()).toBe(Analytics.getAnalytics());
        });
    });
});
