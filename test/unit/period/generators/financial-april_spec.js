import { generateFinancialAprilPeriodsUpToYear } from '../../../../src/period/generators/financial-april';

describe('Financial April period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateFinancialAprilPeriodsUpToYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateFinancialAprilPeriodsUpToYear(-10)).to.throw();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateFinancialAprilPeriodsUpToYear(new Date())).to.throw();
        });

        it('should generate 10 yearly periods when no numberOfYears was passed', () => {
            expect(generateFinancialAprilPeriodsUpToYear(2017)).to.have.length(10);
        });

        it('should generate periods for 10 years with the last one being the current year', () => {
            const tenYearlyPeriods = generateFinancialAprilPeriodsUpToYear(2017);

            expect(tenYearlyPeriods).to.deep.equal([
                {
                    endDate: '2009-03-31',
                    startDate: '2008-04-01',
                    name: 'April 2008 - March 2009',
                    id: '2008April',
                }, {
                    endDate: '2010-03-31',
                    startDate: '2009-04-01',
                    name: 'April 2009 - March 2010',
                    id: '2009April',
                }, {
                    endDate: '2011-03-31',
                    startDate: '2010-04-01',
                    name: 'April 2010 - March 2011',
                    id: '2010April',
                }, {
                    endDate: '2012-03-31',
                    startDate: '2011-04-01',
                    name: 'April 2011 - March 2012',
                    id: '2011April',
                }, {
                    endDate: '2013-03-31',
                    startDate: '2012-04-01',
                    name: 'April 2012 - March 2013',
                    id: '2012April',
                }, {
                    endDate: '2014-03-31',
                    startDate: '2013-04-01',
                    name: 'April 2013 - March 2014',
                    id: '2013April',
                }, {
                    endDate: '2015-03-31',
                    startDate: '2014-04-01',
                    name: 'April 2014 - March 2015',
                    id: '2014April',
                }, {
                    endDate: '2016-03-31',
                    startDate: '2015-04-01',
                    name: 'April 2015 - March 2016',
                    id: '2015April',
                }, {
                    endDate: '2017-03-31',
                    startDate: '2016-04-01',
                    name: 'April 2016 - March 2017',
                    id: '2016April',
                }, {
                    endDate: '2018-03-31',
                    startDate: '2017-04-01',
                    name: 'April 2017 - March 2018',
                    id: '2017April',
                },
            ]);
        });

        it('should respect the number of years parameter and generate that number of years including the current one', () => {
            const fiveYearlyPeriods = generateFinancialAprilPeriodsUpToYear(2017, 5);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2014-03-31',
                    startDate: '2013-04-01',
                    name: 'April 2013 - March 2014',
                    id: '2013April',
                }, {
                    endDate: '2015-03-31',
                    startDate: '2014-04-01',
                    name: 'April 2014 - March 2015',
                    id: '2014April',
                }, {
                    endDate: '2016-03-31',
                    startDate: '2015-04-01',
                    name: 'April 2015 - March 2016',
                    id: '2015April',
                }, {
                    endDate: '2017-03-31',
                    startDate: '2016-04-01',
                    name: 'April 2016 - March 2017',
                    id: '2016April',
                }, {
                    endDate: '2018-03-31',
                    startDate: '2017-04-01',
                    name: 'April 2017 - March 2018',
                    id: '2017April',
                },
            ]);
        });

        it('should throw an error when the numberOfYears is not a positive integer', () => {
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, 'a')).to.throw();
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, 1.2)).to.throw();
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, true)).to.throw();
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, -1)).to.throw();
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, 0)).to.throw();
            expect(() => generateFinancialAprilPeriodsUpToYear(2017, Infinity)).to.throw();
        });

        it('should generate the yearly periods for 2021 and 2022', () => {
            const fiveYearlyPeriods = generateFinancialAprilPeriodsUpToYear(2022, 2);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2022-03-31',
                    startDate: '2021-04-01',
                    name: 'April 2021 - March 2022',
                    id: '2021April',
                }, {
                    endDate: '2023-03-31',
                    startDate: '2022-04-01',
                    name: 'April 2022 - March 2023',
                    id: '2022April',
                },
            ]);
        });

        it('should generate use the current year when no year has been given', () => {
            expect(generateFinancialAprilPeriodsUpToYear()).to.deep.equal(generateFinancialAprilPeriodsUpToYear(2017));
        });
    });
});
