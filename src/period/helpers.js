import { isInteger } from '../lib/check';

export function formatAsISODate(date) {
    if (!(date instanceof Date)) {
        throw new Error('formatAsISODate(date) only accepts Date objects');
    }

    const y = date.getFullYear();
    const m = `0${date.getMonth() + 1}`.substr(-2);
    const d = `0${date.getDate()}`.substr(-2);
    return `${y}-${m}-${d}`;
}

export function filterFuturePeriods(periods) {
    const array = [];
    const now = new Date();

    for (let i = 0; i < periods.length; i++) {
        if (new Date(periods[i].startDate) <= now) {
            array.push(periods[i]);
        }
    }

    return array;
}

export function getYYYYMM(date) {
    const y = date.getFullYear();
    let m = `${date.getMonth() + 1}`;
    m = `0${m}`.substr(-2);
    return y + m;
}

export function getBiMonthlyId(date) {
    const y = date.getFullYear();
    const m = `0${Math.floor(date.getMonth() / 2) + 1}`.substr(-2);
    return `${y + m}B`;
}

export function validateIfValueIsInteger(year) {
    if (!isInteger(year)) {
        throw new Error(
            'Generator should be called with an integer to identify the year.' +
            ' Perhaps you passed a Date object?',
        );
    }

    if (year < 0) {
        throw new Error('Generator does not support generating year before the year 0.');
    }
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export function is53WeekISOYear(year) {
    const p = y => ((y + Math.floor(y / 4)) - Math.floor(y / 100)) + Math.floor(y / 400);

    return p(year) % 7 === 4 || p(year - 1) % 7 === 3;
}

export function addDays(days, date) {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}

export function addMonths(months, date) {
    const result = new Date(date);

    result.setMonth(date.getMonth() + months);

    return result;
}

export function subtractDays(days, date) {
    return addDays(-days, date);
}

export function getFirstDayInFirstISOWeekForYear(year) {
    // The first ISO week of the year always contains 4th January. We can use this as a pointer to start the first week.
    let startDate = new Date(year, 0, 4);

    // January 4th might not be at the start of the week. Therefore we rewind to the start of the week.
    if (startDate.getDay() === 0) {
        startDate = subtractDays(6, startDate);
        // If January 4th is on a Sunday we'll revert back 6 days
    } else {
        // We'll revert back the current day number of days - 1 (Due to the days being 0 indexed with 0 being Sunday)
        const daysAfterMonday = startDate.getDay() - 1;
        startDate = subtractDays(daysAfterMonday, startDate);
    }

    return startDate;
}

export function getLastDayOfTheWeekForFirstDayOfTheWeek(startDate) {
    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 6);

    return endDate;
}

export function getMonthNamesForLocale(locale) {
    const monthNames = [];

    for (let i = 0; i < 12; i += 1) {
        const monthName = new Date(2000, i, 1).toLocaleDateString(locale, { month: 'long' });
        monthNames.push(monthName);
    }

    return monthNames;
}

export function getLastDateOfMonth(year, month) {
    return new Date(new Date(year, month + 1).setDate(0));
}

export function getFirstDateOfQuarter(year, quarter) {
    const startMonth = (quarter - 1) * 3;
    return new Date(year, startMonth);
}

export function getLastDateOfQuarter(year, quarter) {
    return new Date(getFirstDateOfQuarter(year, quarter + 1).setDate(0));
}

const ordTable = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const ordTableLeap = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export function getFirstDateOfWeek(year, week) {
    const isLeapYear = new Date(new Date(year, 2, 1).setDate(0)).getDate() === 29;
    const ordDiff = isLeapYear ? ordTableLeap : ordTable;

    const correction = ((new Date(year, 0, 4)).getDay() || 7) + 3;
    const ordDate = (week * 7) + (1 - correction);
    if (ordDate < 0) {
        return new Date(year, 0, ordDate);
    }

    let month = 11;
    while (ordDate < ordDiff[month]) {
        month--; // eslint-disable-line no-plusplus
    }

    return new Date(year, month, ordDate - ordDiff[month]);
}

/**
 * This function takes some general instructions for a period and returns a precise period containing
 * a start date and end date. It corrects for week 1 starting in a previous year and for week 53 in a
 * 52 week year
 * It is used by the BiWeekly periodType and all flavors of Weekly PeriodTypes,
 * such as Weekly, weeklyWednessday, etc.
 * @param {Object} obj - An object
 * @param {Number} obj.year - Year
 * @param {Number} obj.week - Week number between 1-53
 * @param {String} [obj.locale=en] - The current locale
 * @param {Number} [obj.weekTypeDiff=0] - The difference between the starting day of the week
 * in a given periodType and the first day of the week. This option is being used for different
 * flavors of weekly period types, such as WeeklyWednesday, WeeklyThursday, etc.
 * @param {Number} [obj.periodLength=6] - The amount of days until the end date: 6 for weekly
 * and 13 for Bikweekly
 * @returns {Object} - An object containing various properties that can be used to contruct
 * the final parsed period
 * @example for default scenario
 * computeWeekBasedPeriod({ year: 2019, week: 12})
 * // returns:
 * // {
 * //     week: 12,
 * //     year: 2019,
 * //     startMonthName: 'June',
 * //     startDayNumber: 3,
 * //     endDayNumber: 9,
 * //     startDate: '2019-06-03',
 * //     endDate: '2019-06-09',
 * // }
 * @example for week 53 in 52 week year edge case
 * computeWeekBasedPeriod({ year: 2016, week: 53})
 * // returns:
 * // {
 * //     week: 1,
 * //     year: 2017,
 * //     startMonthName: 'January',
 * //     startDayNumber: 2,
 * //     endDayNumber: 8,
 * //     startDate: '2017-01-02',
 * //     endDate: '2017-01-08',
 * // }
 */
export const computeWeekBasedPeriod = ({ year, week, locale = 'en', weekTypeDiff = 0, periodLength = 6 }) => {
    const startDate = addDays(weekTypeDiff, getFirstDateOfWeek(year, week));
    const monthNames = getMonthNamesForLocale(locale);
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const startMonthName = monthNames[startMonth];
    const startDayNum = startDate.getDate();

    if (week === 53 && startYear !== year) {
        /* eslint-disable no-param-reassign */
        week = 1;
        year = startYear;
        /* eslint-enable */
    }

    const endDate = addDays(periodLength, startDate);
    const endMonth = endDate.getMonth();
    const endDayNum = endDate.getDate();
    const endMonthName = monthNames[endMonth];

    return {
        week,
        year,
        startMonthName,
        startDayNum,
        endMonthName,
        endDayNum,
        startDate: formatAsISODate(startDate),
        endDate: formatAsISODate(endDate),
    };
};
