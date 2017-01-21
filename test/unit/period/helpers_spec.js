import { formatAsISODate, filterFuturePeriods } from '../../../src/period/helpers';

describe('Period helpers', () => {
    describe('formatAsISODate()', () => {
        it('should format a date as YYYY-MM-DD', () => {
            expect(formatAsISODate(new Date(2017, 1, 1))).to.equal('2017-02-01');
        });

        it('should throw when the passed date is not a Date', () => {
            expect(() => formatAsISODate('2017-02-01')).to.throw('formatAsISODate(date) only accepts Date objects');
            expect(() => formatAsISODate()).to.throw('formatAsISODate(date) only accepts Date objects');
            expect(() => formatAsISODate(null)).to.throw('formatAsISODate(date) only accepts Date objects');
            expect(() => formatAsISODate(1)).to.throw('formatAsISODate(date) only accepts Date objects');
        });
    });

    describe('filterFuturePeriods()', () => {
        const firstOfJanuary2017 = 1483228800000;
        let clock;
        const periods = [
            {
                endDate: '2015-12-31',
                startDate: '2015-01-01',
                name: '2015',
                id: '2015',
            }, {
                endDate: '2016-12-31',
                startDate: '2016-01-01',
                name: '2016',
                id: '2016',
            }, {
                endDate: '2017-12-31',
                startDate: '2017-01-01',
                name: '2017',
                id: '2017',
            }, {
                endDate: '2018-12-31',
                startDate: '2018-01-01',
                name: '2018',
                id: '2018',
            }, {
                endDate: '2018-12-31',
                startDate: '2018-01-01',
                name: '2018',
                id: '2018',
            },
        ];

        beforeEach(() => {
            clock = sinon.useFakeTimers(firstOfJanuary2017);
        });

        afterEach(() => {
            clock.restore();
        });

        it('should filter out the future periods', () => {
            expect(filterFuturePeriods(periods)).to.have.length(3);
        });

        it('should filter out the future periods', () => {
            expect(filterFuturePeriods(periods)).to.deep.equal([
                {
                    endDate: '2015-12-31',
                    startDate: '2015-01-01',
                    name: '2015',
                    id: '2015',
                }, {
                    endDate: '2016-12-31',
                    startDate: '2016-01-01',
                    name: '2016',
                    id: '2016',
                }, {
                    endDate: '2017-12-31',
                    startDate: '2017-01-01',
                    name: '2017',
                    id: '2017',
                }
            ]);
        });
    });
});
