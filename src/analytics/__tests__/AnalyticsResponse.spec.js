import fixtures from '../../__fixtures__/fixtures';
import AnalyticsResponse from '../AnalyticsResponse';

const fixture = fixtures.get('/api/analytics/response');

let response;

describe('AnalyticsResponse', () => {
    beforeEach(() => {
        response = new AnalyticsResponse(fixture);
    });

    describe('constructor', () => {
        it('should not be allowed to be called without new', () => {
            expect(() => AnalyticsResponse()).toThrowErrorMatchingSnapshot(); // eslint-disable-line new-cap
        });

        it('should set the response when passed as argument', () => {
            expect(response.response).toEqual(fixture);
        });
    });

    describe('properties', () => {
        describe('.extractHeaders()', () => {
            it('should return the headers from the response', () => {
                const headers = response.extractHeaders();

                expect(headers).toHaveLength(4);
            });
        });

        describe('.extractRows()', () => {
            it('should return the rows from the response', () => {
                const rows = response.extractRows();

                expect(rows).toHaveLength(312);
            });
        });

        describe('.extractMetadata()', () => {
            it('should return the metadata from the response', () => {
                const metadata = response.extractMetadata();

                expect(metadata.dimensions).toEqual(fixture.metaData.dimensions);
                expect(metadata.items).toEqual(fixture.metaData.items);
            });

            // TODO
            // test with OUNAME case
        });
    });
});
