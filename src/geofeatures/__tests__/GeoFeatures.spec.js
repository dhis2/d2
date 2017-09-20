import GeoFeatures from '../GeoFeatures';

describe('GeoFeatures', () => {
    describe('getGeoFeatures', () => {
        it('should create an instance of GeoFeatures', () => {
            expect(GeoFeatures.getGeoFeatures()).toBeInstanceOf(GeoFeatures);
        });
    });
});
