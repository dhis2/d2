import { generateFinancialJulyPeriodsUpToYear } from '../../../../src/period/generators/financial-july';

describe('Financial July period', () => {
    const firstOfJanuary2017 = 1483228800000;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(firstOfJanuary2017);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('generateFinancialJulyPeriodsUpToYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateFinancialJulyPeriodsUpToYear(-10)).to.throw('Generator does not support generating year before the year 0');
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateFinancialJulyPeriodsUpToYear(new Date())).to.throw('Generator should be called with an integer to identify the year. Perhaps you passed a Date object?');
        });

        it('should generate 10 yearly periods when no numberOfYears was passed', () => {
            expect(generateFinancialJulyPeriodsUpToYear(2017)).to.have.length(10);
        });

        it('should generate periods for 10 years with the last one being the current year', () => {
            const tenYearlyPeriods = generateFinancialJulyPeriodsUpToYear(2017);

            expect(tenYearlyPeriods).to.deep.equal([
                {
                    endDate: '2009-06-30',
                    startDate: '2008-07-01',
                    name: 'July 2008 - June 2009',
                    id: '2008July',
                }, {
                    endDate: '2010-06-30',
                    startDate: '2009-07-01',
                    name: 'July 2009 - June 2010',
                    id: '2009July',
                }, {
                    endDate: '2011-06-30',
                    startDate: '2010-07-01',
                    name: 'July 2010 - June 2011',
                    id: '2010July',
                }, {
                    endDate: '2012-06-30',
                    startDate: '2011-07-01',
                    name: 'July 2011 - June 2012',
                    id: '2011July',
                }, {
                    endDate: '2013-06-30',
                    startDate: '2012-07-01',
                    name: 'July 2012 - June 2013',
                    id: '2012July',
                }, {
                    endDate: '2014-06-30',
                    startDate: '2013-07-01',
                    name: 'July 2013 - June 2014',
                    id: '2013July',
                }, {
                    endDate: '2015-06-30',
                    startDate: '2014-07-01',
                    name: 'July 2014 - June 2015',
                    id: '2014July',
                }, {
                    endDate: '2016-06-30',
                    startDate: '2015-07-01',
                    name: 'July 2015 - June 2016',
                    id: '2015July',
                }, {
                    endDate: '2017-06-30',
                    startDate: '2016-07-01',
                    name: 'July 2016 - June 2017',
                    id: '2016July',
                }, {
                    endDate: '2018-06-30',
                    startDate: '2017-07-01',
                    name: 'July 2017 - June 2018',
                    id: '2017July',
                },
            ]);
        });

        it('should respect the number of years parameter and generate that number of years including the current one', () => {
            const fiveYearlyPeriods = generateFinancialJulyPeriodsUpToYear(2017, 5);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2014-06-30',
                    startDate: '2013-07-01',
                    name: 'July 2013 - June 2014',
                    id: '2013July',
                }, {
                    endDate: '2015-06-30',
                    startDate: '2014-07-01',
                    name: 'July 2014 - June 2015',
                    id: '2014July',
                }, {
                    endDate: '2016-06-30',
                    startDate: '2015-07-01',
                    name: 'July 2015 - June 2016',
                    id: '2015July',
                }, {
                    endDate: '2017-06-30',
                    startDate: '2016-07-01',
                    name: 'July 2016 - June 2017',
                    id: '2016July',
                }, {
                    endDate: '2018-06-30',
                    startDate: '2017-07-01',
                    name: 'July 2017 - June 2018',
                    id: '2017July',
                },
            ]);
        });

        it('should throw an error when the numberOfYears is not a positive integer', () => {
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, 'a')).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, 1.2)).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, true)).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, -1)).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, 0)).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
            expect(() => generateFinancialJulyPeriodsUpToYear(2017, Infinity)).to.throw('FinancialJuly generator parameter `numberOfYears` should be an integer larger than 0.');
        });

        it('should generate the yearly periods for 2021 and 2022', () => {
            const fiveYearlyPeriods = generateFinancialJulyPeriodsUpToYear(2022, 2);

            expect(fiveYearlyPeriods).to.deep.equal([
                {
                    endDate: '2022-06-30',
                    startDate: '2021-07-01',
                    name: 'July 2021 - June 2022',
                    id: '2021July',
                }, {
                    endDate: '2023-06-30',
                    startDate: '2022-07-01',
                    name: 'July 2022 - June 2023',
                    id: '2022July',
                },
            ]);
        });

        it('should generate use the current year when no year has been given', () => {
            expect(generateFinancialJulyPeriodsUpToYear()).to.deep.equal(generateFinancialJulyPeriodsUpToYear(2017));
        });
    });
});
