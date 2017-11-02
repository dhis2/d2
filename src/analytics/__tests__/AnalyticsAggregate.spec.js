import fixtures from '../../__fixtures__/fixtures';
import MockApi from '../../api/Api';
import AnalyticsAggregate from '../AnalyticsAggregate';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

const debugSqlFixture = `select de.name as de_name, de.uid as de_uid, de.dataelementid as de_id, pe.startdate as
start_date, pe.enddate as end_date, pt.name as pt_name, ou.name as ou_name, ou.uid as ou_uid, ou.organisationunitid as
ou_id, coc.name as coc_name, coc.uid as coc_uid, coc.categoryoptioncomboid as coc_id, aoc.name as aoc_name, aoc.uid as
aoc_uid, aoc.categoryoptioncomboid as aoc_id, dv.value as datavalue from datavalue dv inner join dataelement de on
dv.dataelementid = de.dataelementid inner join period pe on dv.periodid = pe.periodid inner join periodtype pt on
pe.periodtypeid = pt.periodtypeid inner join organisationunit ou on dv.sourceid = ou.organisationunitid inner join
categoryoptioncombo coc on dv.categoryoptioncomboid = coc.categoryoptioncomboid inner join categoryoptioncombo aoc on
dv.attributeoptioncomboid = aoc.categoryoptioncomboid where dv.dataelementid in (359596,359597) and ((pe.startdate >=
    '2016-01-01' and pe.enddate <= '2016-03-31') or (pe.startdate >= '2016-04-01' and pe.enddate <= '2016-06-30') ) and
((dv.sourceid in (select organisationunitid from _orgunitstructure where idlevel2 = 264)) ) and dv.deleted is false
limit 100000`;

describe('Analytics.aggregate', () => {
    let aggregate;
    let mockApi;
    let fixture;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        aggregate = new AnalyticsAggregate();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsAggregate()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the AnalyticsAggregate instance', () => {
        expect(aggregate.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        aggregate = new AnalyticsAggregate(apiMockObject);

        expect(aggregate.api).toBe(apiMockObject);
    });

    describe('.getDataValueSet()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());
            aggregate.addDimensions([
                'dx:fbfJHSPpUQD.pq2XI5kz2BY;fbfJHSPpUQD.PT59n8BQbqM',
                'pe:LAST_MONTH',
                'ou:ImspTQPwCqd',
            ]);

            fixture = fixtures.get('/api/analytics/dataValueSet');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(aggregate.getDataValueSet).toBeInstanceOf(Function);
        });

        it('should set 3 dimensions', () => {
            expect(aggregate.dimensions.length).toEqual(3);
        });

        it('should set a parameter when passed as argument', () => aggregate.getDataValueSet('json',
            { outputIdScheme: 'CODE' })
            .then(() => {
                expect(aggregate.query.outputIdScheme).toEqual('CODE');
            }));

        it('should resolve a promise with data', () => aggregate.getDataValueSet()
            .then((data) => {
                expect(data.dataValues.length).toEqual(fixture.dataValues.length);
            }));
    });

    describe('.getDebugSql()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());
            aggregate.addDimension('dx:fbfJHSPpUQD;cYeuwXTCPkU')
                .addFilters([
                    'pe:2016Q1;2016Q2',
                    'ou:O6uvpzGd5pu',
                ]);

            mockApi.get.mockReturnValue(Promise.resolve(debugSqlFixture));
        });

        it('should be a function', () => {
            expect(aggregate.getDebugSql).toBeInstanceOf(Function);
        });

        it('should set 1 dimension', () => {
            expect(aggregate.dimensions.length).toEqual(1);
            expect(aggregate.dimensions[0]).toEqual('dx:fbfJHSPpUQD;cYeuwXTCPkU');
        });

        it('should set 2 filters', () => {
            expect(aggregate.filters.length).toEqual(2);
            expect(aggregate.filters[0]).toEqual('pe:2016Q1;2016Q2');
        });

        it('should not add more filters', () => {
            aggregate.addFilters();

            expect(aggregate.filters.length).toEqual(2);
        });

        it('should set a parameter when passed as argument', () => aggregate.getDebugSql({ skipMeta: true })
            .then(() => {
                expect(aggregate.query.skipMeta).toEqual(true);
            }));

        it('should resolve a promise with data', () => aggregate.getDebugSql()
            .then((data) => {
                expect(data).toEqual(debugSqlFixture);
            }));
    });

    describe('.getRawData', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());
            aggregate.addDimensions([
                'dx:fbfJHSPpUQD;cYeuwXTCPkU;Jtf34kNZhzP',
                'J5jldMd8OHv',
                'Bpx0589u8y0',
                'ou:O6uvpzGd5pu;fdc6uOvgoji',
            ])
                .addParameters({
                    startDate: '2016-01-01',
                    endDate: '2016-01-31',
                });

            fixture = fixtures.get('/api/analytics/rawData');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(aggregate.getRawData).toBeInstanceOf(Function);
        });

        it('should set 4 dimensions', () => {
            expect(aggregate.dimensions.length).toEqual(4);
        });

        it('should not add more dimensions', () => {
            aggregate.addDimensions();

            expect(aggregate.dimensions.length).toEqual(4);
        });

        it('should set 2 parameters', () => {
            expect(Object.keys(aggregate.query).length).toEqual(2);
        });

        it('should not add more parameters', () => {
            aggregate.addParameters();

            expect(Object.keys(aggregate.query).length).toEqual(2);
        });

        it('should set a parameter when passed as argument', () => aggregate.getRawData('json', { skipData: true })
            .then(() => {
                expect(aggregate.query.skipData).toEqual(true);
            }));

        it('should resolve a promise with data', () => aggregate.getRawData()
            .then((data) => {
                expect(data.metaData.items).toEqual(fixture.metaData.items);
                expect(data.metaData.dimensions).toEqual(fixture.metaData.dimensions);
                expect(data.width).toEqual(0);
                expect(data.height).toEqual(0);
            }));
    });
});
