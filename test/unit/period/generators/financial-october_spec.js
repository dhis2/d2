import { generateFinancialOctoberPeriodsUpToYear } from '../../../../src/period/generators/financial-october';

describe('Financial October period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateFinancialOctoberPeriodsUpToYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateFinancialOctoberPeriodsUpToYear(-10)).to.throw('Generator does not support generating year before the year 0');
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateFinancialOctoberPeriodsUpToYear(new Date())).to.throw('Generator should be called with an integer to identify the year. Perhaps you passed a Date object?');
        });

        it('should generate 10 yearly periods when no numberOfYears was passed', () => {
            expect(generateFinancialOctoberPeriodsUpToYear(2017)).to.have.length(10);
        });

        it('should generate periods for 10 years with the last one being the current year', () => {
            const tenYearlyPeriods = generateFinancialOctoberPeriodsUpToYear(2017);

            expect(tenYearlyPeriods).to.deep.equal([
                {
                    endDate: '2009-09-30',
                    startDate: '2008-10-01',
                    name: 'October 2008 - September 2009',
                    id: '2008Oct',
                }, {
                    endDate: '2010-09-30',
                    startDate: '2009-10-01',
                    name: 'October 2009 - September 2010',
                    id: '2009Oct',
                }, {
                    endDate: '2011-09-30',
                    startDate: '2010-10-01',
                    name: 'October 2010 - September 2011',
                    id: '2010Oct',
                }, {
                    endDate: '2012-09-30',
                    startDate: '2011-10-01',
                    name: 'October 2011 - September 2012',
                    id: '2011Oct',
                }, {
                    endDate: '2013-09-30',
                    startDate: '2012-10-01',
                    name: 'October 2012 - September 2013',
                    id: '2012Oct',
                }, {
                    endDate: '2014-09-30',
                    startDate: '2013-10-01',
                    name: 'October 2013 - September 2014',
                    id: '2013Oct',
                }, {
                    endDate: '2015-09-30',
                    startDate: '2014-10-01',
                    name: 'October 2014 - September 2015',
                    id: '2014Oct',
                }, {
                    endDate: '2016-09-30',
                    startDate: '2015-10-01',
                    name: 'October 2015 - September 2016',
                    id: '2015Oct',
                }, {
                    endDate: '2017-09-30',
                    startDate: '2016-10-01',
                    name: 'October 2016 - September 2017',
                    id: '2016Oct',
                }, {
                    endDate: '2018-09-30',
                    startDate: '2017-10-01',
                    name: 'October 2017 - September 2018',
                    id: '2017Oct',
                },
            ]);
        });

        it('should respect the number of years parameter and generate that number of years including the current one', () => {
            const fiveYearlyPeriods = generateFinancialOctoberPeriodsUpToYear(2017, 5);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2014-09-30',
                    startDate: '2013-10-01',
                    name: 'October 2013 - September 2014',
                    id: '2013Oct',
                }, {
                    endDate: '2015-09-30',
                    startDate: '2014-10-01',
                    name: 'October 2014 - September 2015',
                    id: '2014Oct',
                }, {
                    endDate: '2016-09-30',
                    startDate: '2015-10-01',
                    name: 'October 2015 - September 2016',
                    id: '2015Oct',
                }, {
                    endDate: '2017-09-30',
                    startDate: '2016-10-01',
                    name: 'October 2016 - September 2017',
                    id: '2016Oct',
                }, {
                    endDate: '2018-09-30',
                    startDate: '2017-10-01',
                    name: 'October 2017 - September 2018',
                    id: '2017Oct',
                },
            ]);
        });

        it('should throw an error when the numberOfYears is not a positive integer', () => {
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, 'a')).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, 1.2)).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, true)).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, -1)).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, 0)).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialOctoberPeriodsUpToYear(2017, Infinity)).to.throw('FinancialOctober generator parameter `numberOfYears` should be an integer larger than 0.');
        });

        it('should generate the yearly periods for 2021 and 2022', () => {
            const fiveYearlyPeriods = generateFinancialOctoberPeriodsUpToYear(2022, 2);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2022-09-30',
                    startDate: '2021-10-01',
                    name: 'October 2021 - September 2022',
                    id: '2021Oct',
                }, {
                    endDate: '2023-09-30',
                    startDate: '2022-10-01',
                    name: 'October 2022 - September 2023',
                    id: '2022Oct',
                },
            ]);
        });

        it('should generate use the current year when no year has been given', () => {
            expect(generateFinancialOctoberPeriodsUpToYear()).to.deep.equal(generateFinancialOctoberPeriodsUpToYear(2017));
        });
    });
});
