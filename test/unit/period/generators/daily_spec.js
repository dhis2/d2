import { generateDailyPeriodsForYear } from '../../../../src/period/generators/daily';

describe('Daily period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateDailyPeriods()', () => {        
        it('should return 365 day items for 2017', () => {
            expect(generateDailyPeriodsForYear()).to.have.length(365);
        });

        it('should return 366 day items for a leap year (2016)', () => {
            expect(generateDailyPeriodsForYear(2016)).to.have.length(366);
        });

        it('should have the expected format for each period', () => {
            const periods = generateDailyPeriodsForYear(2017);

            expect(periods[0]).to.deep.equal({
                startDate: '2017-01-01',
                endDate: '2017-01-01',
                name: 'January 1, 2017',
                id: '20170101',
            });
        });

        it('should not allow years before the year zero', () => {
            expect(() => generateDailyPeriodsForYear(-10)).to.throw();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateDailyPeriodsForYear(new Date())).to.throw();
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateDailyPeriodsForYear()).to.deep.equal(generateDailyPeriodsForYear(2017));
        }); 
    });
});
