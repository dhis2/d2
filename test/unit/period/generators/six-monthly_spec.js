import { generateSixMonthlyPeriodsForYear } from '../../../../src/period/generators/six-monthly';

describe('Six-monthly period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateSixMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateSixMonthlyPeriodsForYear(-10)).to.throw('Generator does not support generating year before the year 0');
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateSixMonthlyPeriodsForYear(new Date())).to.throw('Generator should be called with an integer to identify the year. Perhaps you passed a Date object?');
        });

        it('should generate two quarterly periods', () => {
            expect(generateSixMonthlyPeriodsForYear(2017)).to.have.length(2);
        });

        it('should generate the correct two six-monthly periods', () => {
            expect(generateSixMonthlyPeriodsForYear(2017)).to.deep.equal([
                {
                    startDate: '2017-01-01',
                    endDate: '2017-06-30',
                    name: 'January - June 2017',
                    id: '2017S1',
                }, {
                    startDate: '2017-07-01',
                    endDate: '2017-12-31',
                    name: 'July - December 2017',
                    id: '2017S2',
                },
            ]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateSixMonthlyPeriodsForYear()).to.deep.equal(generateSixMonthlyPeriodsForYear(2017));
        });
    });
});
