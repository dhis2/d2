import { generateBiMonthlyPeriodsForYear } from '../../../../src/period/generators/bi-monthly';

describe('Bi-monthly period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateBiMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateBiMonthlyPeriodsForYear(-10)).to.throw('Generator does not support generating year before the year 0');
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateBiMonthlyPeriodsForYear(new Date())).to.throw('Generator should be called with an integer to identify the year. Perhaps you passed a Date object?');
        });

        it('should return 6 bi-monthly periods for 2017', () => {
            expect(generateBiMonthlyPeriodsForYear(2017)).to.have.length(6);
        });

        it('should return the correct periods for a year', () => {
            expect(generateBiMonthlyPeriodsForYear(2017)).to.deep.equal([{
                startDate: '2017-01-01',
                endDate: '2017-02-28',
                name: `January - February 2017`,
                id: '201701B',
            }, {
                startDate: '2017-03-01',
                endDate: '2017-04-30',
                name: `March - April 2017`,
                id: '201703B',
            }, {
                startDate: '2017-05-01',
                endDate: '2017-06-30',
                name: `May - June 2017`,
                id: '201705B',
            }, {
                startDate: '2017-07-01',
                endDate: '2017-08-31',
                name: `July - August 2017`,
                id: '201707B',
            }, {
                startDate: '2017-09-01',
                endDate: '2017-10-31',
                name: `September - October 2017`,
                id: '201709B',
            }, {
                startDate: '2017-11-01',
                endDate: '2017-12-31',
                name: `November - December 2017`,
                id: '201711B',
            }]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateBiMonthlyPeriodsForYear()).to.deep.equal(generateBiMonthlyPeriodsForYear(2017));
        });        
    });
});