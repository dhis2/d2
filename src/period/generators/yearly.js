import { isInteger } from '../../lib/check';
import { validateIfValueIsInteger, formatAsISODate, getCurrentYear, addDays, monthNames, getYYYYMM } from '../helpers';

export function generateYearlyPeriodsUpToYear(year = getCurrentYear(), numberOfYears = 10) {
    validateIfValueIsInteger(year);
    if ((!isInteger(numberOfYears)) || numberOfYears < 1) { throw new Error('Yearly generator parameter `numberOfYears` should be an integer larger than 0.'); }

    let periods = [];
    const date = new Date(`31 Dec ${year}`);

    while ((year - date.getFullYear()) < numberOfYears) {
        const period = {};
        period['endDate'] = formatAsISODate(date);
        date.setMonth(0, 1);
        period['startDate'] = formatAsISODate(date);
        period['name'] = date.getFullYear().toString();
        //period['id'] = 'Yearly_' + period['startDate'];
        // period['iso'] = date.getFullYear().toString();
        period['id'] = date.getFullYear().toString();
        periods.push(period);
        date.setDate(0);
    }

    // Years are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.
    return periods.reverse();
}
