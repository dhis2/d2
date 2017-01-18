import { createPeriodGeneratorsForLocale } from '../../../../src/period/generators';
import * as daily from '../../../../src/period/generators/daily';
import * as weekly from '../../../../src/period/generators/weekly';
import * as monthly from '../../../../src/period/generators/monthly';
import * as bimonthly from '../../../../src/period/generators/bi-monthly';
import * as quarterly from '../../../../src/period/generators/quarterly';
import * as sixmonthly from '../../../../src/period/generators/six-monthly';
import * as sixmonthlyapril from '../../../../src/period/generators/six-monthly-april';
import * as yearly from '../../../../src/period/generators/yearly';
import * as financialoctober from '../../../../src/period/generators/financial-october';
import * as financialjuly from '../../../../src/period/generators/financial-july';
import * as financialapril from '../../../../src/period/generators/financial-april';

describe('generators', () => {
    describe('createPeriodGeneratorsForLocale()', () => {
        describe('daily', () => {
            beforeEach(() => {
                sinon.spy(daily, 'generateDailyPeriodsForYear');
            });

            afterEach(() => {
                daily.generateDailyPeriodsForYear.restore();
            });

            it('should have the daily period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateDailyPeriodsForYear).to.be.a('function');
            });

            it('should call the the daily generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateDailyPeriodsForYear(2017);

                expect(daily.generateDailyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateDailyPeriodsForYear(2017);

                expect(generators.generateDailyPeriodsForYear(2017)).to.deep.equal(daily.generateDailyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('weekly', () => {
            beforeEach(() => {
                sinon.spy(weekly, 'generateWeeklyPeriodsForYear');
            });

            afterEach(() => {
                weekly.generateWeeklyPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateWeeklyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateWeeklyPeriodsForYear(2017);

                expect(weekly.generateWeeklyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateWeeklyPeriodsForYear(2017);

                expect(generators.generateWeeklyPeriodsForYear(2017)).to.deep.equal(weekly.generateWeeklyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('monthly', () => {
            beforeEach(() => {
                sinon.spy(monthly, 'generateMonthlyPeriodsForYear');
            });

            afterEach(() => {
                monthly.generateMonthlyPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateMonthlyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateMonthlyPeriodsForYear(2017);

                expect(monthly.generateMonthlyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateMonthlyPeriodsForYear(2017);

                expect(generators.generateMonthlyPeriodsForYear(2017)).to.deep.equal(monthly.generateMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('bi-monthly', () => {
            beforeEach(() => {
                sinon.spy(bimonthly, 'generateBiMonthlyPeriodsForYear');
            });

            afterEach(() => {
                bimonthly.generateBiMonthlyPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateBiMonthlyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateBiMonthlyPeriodsForYear(2017);

                expect(bimonthly.generateBiMonthlyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateBiMonthlyPeriodsForYear(2017);

                expect(generators.generateBiMonthlyPeriodsForYear(2017)).to.deep.equal(bimonthly.generateBiMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('quarterly', () => {
            beforeEach(() => {
                sinon.spy(quarterly, 'generateQuarterlyPeriodsForYear');
            });

            afterEach(() => {
                quarterly.generateQuarterlyPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateQuarterlyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateQuarterlyPeriodsForYear(2017);

                expect(quarterly.generateQuarterlyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateQuarterlyPeriodsForYear(2017);

                expect(generators.generateQuarterlyPeriodsForYear(2017)).to.deep.equal(quarterly.generateQuarterlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('six-monthly', () => {
            beforeEach(() => {
                sinon.spy(sixmonthly, 'generateSixMonthlyPeriodsForYear');
            });

            afterEach(() => {
                sixmonthly.generateSixMonthlyPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateSixMonthlyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyPeriodsForYear(2017);

                expect(sixmonthly.generateSixMonthlyPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyPeriodsForYear(2017);

                expect(generators.generateSixMonthlyPeriodsForYear(2017)).to.deep.equal(sixmonthly.generateSixMonthlyPeriodsForYear(2017, 'nl'));
            });
        });

        describe('six-monthly-april', () => {
            beforeEach(() => {
                sinon.spy(sixmonthlyapril, 'generateSixMonthlyAprilPeriodsForYear');
            });

            afterEach(() => {
                sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateSixMonthlyPeriodsForYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyAprilPeriodsForYear(2017);

                expect(sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear).to.be.calledWith(2017, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateSixMonthlyAprilPeriodsForYear(2017);

                expect(generators.generateSixMonthlyAprilPeriodsForYear(2017)).to.deep.equal(sixmonthlyapril.generateSixMonthlyAprilPeriodsForYear(2017, 'nl'));
            });
        });

        describe('yearly', () => {
            beforeEach(() => {
                sinon.spy(yearly, 'generateYearlyPeriodsUpToYear');
            });

            afterEach(() => {
                yearly.generateYearlyPeriodsUpToYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateYearlyPeriodsUpToYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(yearly.generateYearlyPeriodsUpToYear).to.be.calledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(generators.generateYearlyPeriodsUpToYear(2017, 10)).to.deep.equal(yearly.generateYearlyPeriodsUpToYear(2017, 10, 'nl'));
            });
        });

        describe('yearly', () => {
            beforeEach(() => {
                sinon.spy(yearly, 'generateYearlyPeriodsUpToYear');
            });

            afterEach(() => {
                yearly.generateYearlyPeriodsUpToYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateYearlyPeriodsUpToYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(yearly.generateYearlyPeriodsUpToYear).to.be.calledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateYearlyPeriodsUpToYear(2017);

                expect(generators.generateYearlyPeriodsUpToYear(2017, 10)).to.deep.equal(yearly.generateYearlyPeriodsUpToYear(2017, 10, 'nl'));
            });
        });

        describe('financial-october', () => {
            beforeEach(() => {
                sinon.spy(financialoctober, 'generateFinancialOctoberPeriodsUpToYear');
            });

            afterEach(() => {
                financialoctober.generateFinancialOctoberPeriodsUpToYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateFinancialOctoberPeriodsUpToYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialOctoberPeriodsUpToYear(2017);

                expect(financialoctober.generateFinancialOctoberPeriodsUpToYear).to.be.calledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialOctoberPeriodsUpToYear(2017);

                expect(generators.generateFinancialOctoberPeriodsUpToYear(2017, 5)).to.deep.equal(financialoctober.generateFinancialOctoberPeriodsUpToYear(2017, 5, 'nl'));
            });
        });

        describe('financial-july', () => {
            beforeEach(() => {
                sinon.spy(financialjuly, 'generateFinancialJulyPeriodsUpToYear');
            });

            afterEach(() => {
                financialjuly.generateFinancialJulyPeriodsUpToYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateFinancialJulyPeriodsUpToYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialJulyPeriodsUpToYear(2017);

                expect(financialjuly.generateFinancialJulyPeriodsUpToYear).to.be.calledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialJulyPeriodsUpToYear(2017);

                expect(generators.generateFinancialJulyPeriodsUpToYear(2017, 5)).to.deep.equal(financialjuly.generateFinancialJulyPeriodsUpToYear(2017, 5, 'nl'));
            });
        });

        describe('financial-april', () => {
            beforeEach(() => {
                sinon.spy(financialapril, 'generateFinancialAprilPeriodsUpToYear');
            });

            afterEach(() => {
                financialapril.generateFinancialAprilPeriodsUpToYear.restore();
            });

            it('should have the weekly period generator', () => {
                expect(createPeriodGeneratorsForLocale('nl').generateFinancialAprilPeriodsUpToYear).to.be.a('function');
            });

            it('should call the weekly generator with the correct locale', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialAprilPeriodsUpToYear(2017);

                expect(financialapril.generateFinancialAprilPeriodsUpToYear).to.be.calledWith(2017, undefined, 'nl');
            });

            it('should return the same result as when calling the generator directly', () => {
                const generators = createPeriodGeneratorsForLocale('nl');

                generators.generateFinancialAprilPeriodsUpToYear(2017);

                expect(generators.generateFinancialAprilPeriodsUpToYear(2017, 5)).to.deep.equal(financialapril.generateFinancialAprilPeriodsUpToYear(2017, 5, 'nl'));
            });
        });
    });
});
