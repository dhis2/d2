import { generateSixMonthlyAprilPeriodsForYear } from '../../../../src/period/generators/six-monthly-april';

describe('Six-monthly-april period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateSixMonthlyAprilPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateSixMonthlyAprilPeriodsForYear(-10)).to.throw();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateSixMonthlyAprilPeriodsForYear(new Date())).to.throw();
        });

        it('should generate the correct six monthly april periods for 2017', () => {
            expect(generateSixMonthlyAprilPeriodsForYear(2017)).to.deep.equal([
                {
                    startDate: '2017-04-01',
                    endDate: '2017-09-30',
                    name: 'April - September 2017',
                    iso: '2017AprilS1',
                    id: '2017AprilS1',
                },
                {
                    startDate: '2017-10-01',
                    endDate: '2018-03-31',
                    name: 'October 2017 - March 2018',
                    iso: '2017AprilS2',
                    id: '2017AprilS2',
                },
            ]);
        });

        it('should generate the correct six monthly april periods for 2014', () => {
            expect(generateSixMonthlyAprilPeriodsForYear(2014)).to.deep.equal([
                {
                    startDate: '2014-04-01',
                    endDate: '2014-09-30',
                    name: 'April - September 2014',
                    iso: '2014AprilS1',
                    id: '2014AprilS1',
                },
                {
                    startDate: '2014-10-01',
                    endDate: '2015-03-31',
                    name: 'October 2014 - March 2015',
                    iso: '2014AprilS2',
                    id: '2014AprilS2',
                },
            ]);
        });

        it('should use the current year when no year has been given', () => {
            expect(generateSixMonthlyAprilPeriodsForYear()).to.deep.equal(generateSixMonthlyAprilPeriodsForYear(2017));
        });
    });
});
