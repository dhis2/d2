import { generateMonthlyPeriodsForYear } from '../../../../src/period/generators/monthly';

describe('Monthly period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateMonthlyPeriodsForYear(-10)).to.throw('Generator does not support generating year before the year 0');
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateMonthlyPeriodsForYear(new Date())).to.throw('Generator should be called with an integer to identify the year. Perhaps you passed a Date object?');
        });

        it('should return 12 monthly periods for 2017', () => {
            expect(generateMonthlyPeriodsForYear()).to.have.length(12);
        });
        
        it('should return the correct content for each period', () => {
            const monthlyPeriods = generateMonthlyPeriodsForYear(2017);

            expect(monthlyPeriods[0]).to.deep.equal({
                startDate: '2017-01-01',
                endDate: '2017-01-31',
                name: 'January 2017',
                id: '201701',
            });
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateMonthlyPeriodsForYear()).to.deep.equal(generateMonthlyPeriodsForYear(2017));
        });  
    });
});
