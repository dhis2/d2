import MockApi from '../../api/Api';
import GeoFeatures from '../GeoFeatures';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

describe('GeoFeatures', () => {
    let geoFeatures;

    beforeEach(() => {
        geoFeatures = new GeoFeatures();
    });

    describe('getGeoFeatures', () => {
        it('should create an instance of GeoFeatures', () => {
            expect(GeoFeatures.getGeoFeatures()).toBeInstanceOf(GeoFeatures);
        });
    });

    describe('byOrgUnit', () => {
        it('should return an instance of GeoFeatures', () => {
            expect(geoFeatures.byOrgUnit()).toBeInstanceOf(GeoFeatures);
        });

        /*
        it('should add LEVEL-3 to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit('LEVEL-3');

            expect(geoFeatures.orgUnits).toContain('LEVEL-3');
        });
        */

        /*
        it('should add LEVEL-3 and org unit to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit(['LEVEL-3', 'YuQRtpLP10I']);

            expect(geoFeatures.orgUnits).toEqual(['LEVEL-3', 'YuQRtpLP10I']);
        });
        */

        it('should not add undefined to the orgUnits array', () => {
            geoFeatures = geoFeatures.byOrgUnit(undefined);

            expect(geoFeatures.orgUnits).not.toContain(undefined);
        });
    });

    /*
    describe('byUserOrgUnit', () => {
        it('should throw when called with invalid uid', () => {
            expect(() => geoFeatures.byUserOrgUnit('invalid')).toThrow('User organisation units should be a valid uid');
        });
    });
    */

    describe('getAll', () => {
        let mockApi;

        beforeEach(() => {
            mockApi = MockApi.getApi();
        });

        afterEach(() => {
            MockApi.mockReset();
        });

        it('should request geoFeature for one org unit', () => {
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures.byOrgUnit('YuQRtpLP10I').getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:YuQRtpLP10I',
            });
        });

        it('should request geoFeature for multiple org units', () => { // TODO
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures
                .byOrgUnit(['XuQRtpLP10I', 'YuQRtpLP10I'])
                .getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:XuQRtpLP10I;YuQRtpLP10I',
            });
        });

        /*
        it('should request geoFeature for user org unit at a level', () => { // TODO
            mockApi.get.mockReturnValue(Promise.resolve([]));

            geoFeatures = geoFeatures
                .byOrgUnit('LEVEL-2')
                .byUserOrgUnit('YuQRtpLP10I')
                .getAll();

            expect(mockApi.get).toBeCalledWith('geoFeatures', {
                ou: 'ou:LEVEL-2',
                userOrgUnit: 'YuQRtpLP10I',
            });
        });
        */

        // TODO: test with mutiple user org units
        // TODO: test with display Name

        it('should return an array of geoFeatures', () => {
            mockApi.get.mockReturnValue(Promise.resolve([
                {
                    id: 'YuQRtpLP10I',
                },
            ]));

            // Async test
            return geoFeatures.byOrgUnit('YuQRtpLP10I').getAll().then((features) => {
                expect(features).toEqual([
                    {
                        id: 'YuQRtpLP10I',
                    },
                ]);
            });
        });
    });
});
