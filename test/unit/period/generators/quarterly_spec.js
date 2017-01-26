import { generateQuarterlyPeriodsForYear } from '../../../../src/period/generators/quarterly';

describe('Quarterly period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateQuarterlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateQuarterlyPeriodsForYear(-10)).to.throw();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateQuarterlyPeriodsForYear(new Date())).to.throw();
        });

        it('should generate 4 periods for a year', () => {
            expect(generateQuarterlyPeriodsForYear(2017)).to.have.length(4);
        });

        it('should generate the correct quarter periods', () => {
            expect(generateQuarterlyPeriodsForYear(2017)).to.deep.equal([
                {
                    startDate: '2017-01-01',
                    endDate: '2017-03-31',
                    name: 'January - March 2017',
                    id: '2017Q1',
                }, {
                    startDate: '2017-04-01',
                    endDate: '2017-06-30',
                    name: 'April - June 2017',
                    id: '2017Q2',
                }, {
                    startDate: '2017-07-01',
                    endDate: '2017-09-30',
                    name: 'July - September 2017',
                    id: '2017Q3',
                }, {
                    startDate: '2017-10-01',
                    endDate: '2017-12-31',
                    name: 'October - December 2017',
                    id: '2017Q4',
                },
            ]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateQuarterlyPeriodsForYear()).to.deep.equal(generateQuarterlyPeriodsForYear(2017));
        });
    });
});
