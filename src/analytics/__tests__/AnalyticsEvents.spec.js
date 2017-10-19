import MockApi from '../../api/Api';
import AnalyticsEvents from '../AnalyticsEvents';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

const aggregateFixture = {
    headers: [
        {
            name: 'pe',
            column: 'Period',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'ou',
            column: 'Organisation unit',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'value',
            column: 'Value',
            valueType: 'NUMBER',
            type: 'java.lang.Double',
            hidden: false,
            meta: false,
        },
    ],
    metaData: {
        items: {
            2016: {
                name: '2016',
            },
            eBAyeGv0exc: {
                name: 'Inpatient morbidity and mortality',
            },
            pe: {
                name: 'Period',
            },
            ou: {
                name: 'Organisation unit',
            },
            oZg33kd9taw: {
                name: 'Gender',
            },
            O6uvpzGd5pu: {
                name: 'Bo',
            },
            Zj7UnCAulEk: {
                name: 'Inpatient morbidity and mortality',
            },
        },
        dimensions: {
            pe: [
                '2016',
            ],
            ou: [
                'O6uvpzGd5pu',
            ],
            oZg33kd9taw: [
                'Female',
            ],
        },
    },
    width: 3,
    height: 1,
    rows: [
        [
            '2016',
            'O6uvpzGd5pu',
            '2875',
        ],
    ],
};

const countFixture = {
    extent: 'BOX(-13.2918767970897 7.03619788650982,-10.4230779890038 9.93645059665293)',
    count: 876,
};

const clusterFixture = {
    headers: [
        {
            name: 'count',
            column: 'Count',
            valueType: 'NUMBER',
            type: 'java.lang.Long',
            hidden: false,
            meta: false,
        },
        {
            name: 'center',
            column: 'Center',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'extent',
            column: 'Extent',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'points',
            column: 'Points',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
    ],
    width: 4,
    height: 10,
    rows: [
        [
            '982',
            'POINT(-13.093497259328 8.297795753004)',
            'BOX(-13.2364209257547 8.19464908960502,-12.9915969378945 8.4070503152807)',
            '',
        ],
        [
            '13',
            'POINT(-12.5308221680391 7.5227778868009)',
            'BOX(-12.538632303281 7.51716118885692,-12.5153926151743 7.53074357767397)',
            '',
        ],
        [
            '420',
            'POINT(-12.7445731462672 7.64041505171396)',
            'BOX(-12.8851814518112 7.53208888204428,-12.3894881563778 7.89067537274856)',
            '',
        ],
        [
            '1726',
            'POINT(-12.6963892509298 8.34408617826564)',
            'BOX(-12.9913897096576 8.24891764848881,-12.3871740442386 8.40715308335767)',
            '',
        ],
        [
            '3484',
            'POINT(-11.9772562688692 7.40820958660907)',
            'BOX(-12.3666358806116 7.15817193519812,-11.7832052201469 7.53126197674204)',
            '',
        ],
        [
            '7955',
            'POINT(-12.0245978430466 7.79679259403839)',
            'BOX(-12.3863025646855 7.53148564447814,-11.7829162395671 8.12975298235189)',
            '',
        ],
        [
            '3377',
            'POINT(-12.0843102030209 8.30168692306219)',
            'BOX(-12.3869615092337 8.1300549915313,-11.783044965593 8.40714378261247)',
            '',
        ],
        [
            '8557',
            'POINT(-11.5161290688005 7.23822029720588)',
            'BOX(-11.7829022718725 6.9345563804046,-11.2500029109502 7.53135591684737)',
            '',
        ],
        [
            '8194',
            'POINT(-11.5208595190863 7.86163372027884)',
            'BOX(-11.7828952332003 7.53141594762764,-11.2501109792394 8.12988404664244)',
            '',
        ],
        [
            '2351',
            'POINT(-11.4238545410568 8.26635359551235)',
            'BOX(-11.7813049867115 8.13020986211931,-11.2501857800675 8.40716313767527)',
            '',
        ],
    ],
};

const queryFixture = {
    headers: [
        {
            name: 'psi',
            column: 'Event',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'ps',
            column: 'Program stage',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'eventdate',
            column: 'Event date',
            valueType: 'DATE',
            type: 'java.util.Date',
            hidden: false,
            meta: true,
        },
        {
            name: 'longitude',
            column: 'Longitude',
            valueType: 'NUMBER',
            type: 'java.lang.Double',
            hidden: false,
            meta: true,
        },
        {
            name: 'latitude',
            column: 'Latitude',
            valueType: 'NUMBER',
            type: 'java.lang.Double',
            hidden: false,
            meta: true,
        },
        {
            name: 'ouname',
            column: 'Organisation unit name',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'oucode',
            column: 'Organisation unit code',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'ou',
            column: 'Organisation unit',
            valueType: 'TEXT',
            type: 'java.lang.String',
            hidden: false,
            meta: true,
        },
        {
            name: 'qrur9Dvnyt5',
            column: 'Age in years',
            valueType: 'INTEGER',
            type: 'java.lang.Integer',
            hidden: false,
            meta: true,
        },
    ],
    metaData: {
        pager: {
            page: 1,
            total: 2539,
            pageSize: 5,
            pageCount: 508,
        },
        items: {
            ImspTQPwCqd: {
                name: 'Sierra Leone',
            },
            eBAyeGv0exc: {
                name: 'Inpatient morbidity and mortality',
            },
            ou: {
                name: 'Organisation unit',
            },
            qrur9Dvnyt5: {
                name: 'Age in years',
            },
            Zj7UnCAulEk: {
                name: 'Inpatient morbidity and mortality',
            },
        },
        dimensions: {
            pe: [],
            ou: [
                'ImspTQPwCqd',
            ],
            qrur9Dvnyt5: [],
        },
    },
    rows: [
        [
            'bOMUg488bV3',
            'Zj7UnCAulEk',
            '2017-09-21 00:00:00.0',
            '0.0',
            '0.0',
            'Hamdalai MCHP',
            'OU_226254',
            'HDOnfLXKkYs',
            '36',
        ],
        [
            'OKiK3fV3uEs',
            'Zj7UnCAulEk',
            '2017-09-14 00:00:00.0',
            '0.0',
            '0.0',
            'Kania MCHP',
            'OU_226265',
            'AGrsLyKWrVX',
            '38',
        ],
        [
            'rornXV8m5n8',
            'Zj7UnCAulEk',
            '2017-09-02 00:00:00.0',
            '0.0',
            '0.0',
            'Motonkoh MCHP',
            'OU_247041',
            'BpWJ3cRsO6g',
            '12',
        ],
        [
            'NQEtEOBQYlt',
            'Zj7UnCAulEk',
            '2017-09-16 00:00:00.0',
            '0.0',
            '0.0',
            'Pejewa MCHP',
            'OU_260390',
            'BTXwf2gl7av',
            '29',
        ],
        [
            'Q9nct08a577',
            'Zj7UnCAulEk',
            '2017-09-26 00:00:00.0',
            '0.0',
            '0.0',
            'Samandu MCHP',
            'OU_233369',
            'g9xUM1x1f1i',
            '10',
        ],
    ],
    width: 9,
    height: 5,
};

describe('analytics.events', () => {
    let events;
    let mockApi;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        events = new AnalyticsEvents();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsEvents()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the Analyticsevents instance', () => {
        expect(events.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        events = new AnalyticsEvents('program-test', apiMockObject);

        expect(events.api).toBe(apiMockObject);
    });

    describe('.setProgram()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents('program-test', new MockApi());
        });

        it('should be a function', () => {
            expect(events.setProgram).toBeInstanceOf(Function);
        });

        it('should return itself', () => expect(events.setProgram('test')).toBeInstanceOf(AnalyticsEvents));

        it('should set the program id', () => {
            events.setProgram('test2');

            expect(events.program).toEqual('test2');
        });
    });

    describe('.getAggregate()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents('program-test', new MockApi());

            mockApi.get.mockReturnValue(Promise.resolve(aggregateFixture));
        });

        it('should be a function', () => {
            expect(events.getAggregate).toBeInstanceOf(Function);
        });

        it('should set a parameter when passed as argument', () => events.getAggregate({ limit: 10 })
            .then(() => {
                expect(events.query.limit).toEqual(10);
            }));

        it('should resolve a promise with data', () => events.getAggregate()
            .then((data) => {
                expect(data).toEqual(aggregateFixture);
            }));
    });

    describe('.getCount()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents('eBAyeGv0exc', new MockApi());
            events.addDimensions([
                'pe:LAST_YEAR',
                'ou:ImspTQPwCqd',
                'qrur9Dvnyt5:LT:50',
            ]);

            mockApi.get.mockReturnValue(Promise.resolve(countFixture));
        });

        it('should be a function', () => {
            expect(events.getCount).toBeInstanceOf(Function);
        });

        it('should set 3 dimensions', () => {
            expect(events.dimensions.length).toEqual(3);
        });

        it('should set a parameter when passed as argument', () => events.getCount({ stage: 'Zj7UnCAulEk' })
            .then(() => {
                expect(events.query.stage).toEqual('Zj7UnCAulEk');
            }));

        it('should resolve a promise with data', () => events.getCount()
            .then((data) => {
                expect(data.count).toEqual(countFixture.count);
                expect(data.extent).toEqual(countFixture.extent);
            }));
    });

    describe('.getCluster()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents('VBqh0ynB2wv', new MockApi());
            events.addDimensions([
                'ou:ImspTQPwCqd',
            ])
                .addParameters({
                    stage: 'pTo4uMt3xur',
                    startDate: '2016-10-17',
                    endDate: '2017-10-17',
                    coordinatesOnly: true,
                    bbox: '-14.062500000000002,5.61598581915534,-11.25,8.407168163601076',
                    clusterSize: 67265,
                    includeClusterPoints: false,
                });

            mockApi.get.mockReturnValue(Promise.resolve(clusterFixture));
        });

        it('should be a function', () => {
            expect(events.getCluster).toBeInstanceOf(Function);
        });

        it('should set 1 dimension', () => {
            expect(events.dimensions.length).toEqual(1);
        });

        it('should set 7 parameters', () => {
            expect(Object.keys(events.query).length).toEqual(7);
        });

        it('should set a parameter when passed as argument', () => events.getCluster({ clusterSize: 10 })
            .then(() => {
                expect(events.query.clusterSize).toEqual(10);
            }));

        it('should resolve a promise with data', () => events.getCluster()
            .then((data) => {
                expect(data.width).toEqual(clusterFixture.width);
                expect(data.height).toEqual(clusterFixture.height);
            }));
    });

    describe('.getQuery()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents('', new MockApi());
            events.addDimensions([
                'ou:ImspTQPwCqd',
                'qrur9Dvnyt5:LT:50',
            ])
                .addFilter('pe:LAST_MONTH')
                .addParameters({
                    stage: 'Zj7UnCAulEk',
                    page: 1,
                    pageSize: 5,
                });

            mockApi.get.mockReturnValue(Promise.resolve(queryFixture));
        });

        it('should be a function', () => {
            expect(events.getQuery).toBeInstanceOf(Function);
        });

        it('should set 2 dimensions', () => {
            expect(events.dimensions.length).toEqual(2);
        });

        it('should set 1 filter', () => {
            expect(events.filters.length).toEqual(1);
        });

        it('should set 3 parameters', () => {
            expect(Object.keys(events.query).length).toEqual(3);
        });

        it('should set a parameter when passed as argument', () => events.getQuery({ page: 2 })
            .then(() => {
                expect(events.query.page).toEqual(2);
            }));

        it('should resolve a promise with data', () => events.getQuery()
            .then((data) => {
                expect(data.width).toEqual(queryFixture.width);
                expect(data.height).toEqual(queryFixture.height);
            }));
    });
});
