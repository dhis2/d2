import AnalyticsResponseRow from '../AnalyticsResponseRow';

let responseRow;
const row = ['Male', '201706', 'O6uvpzGd5pu', '47'];

describe('AnalyticsResponseRow', () => {
    beforeEach(() => {
        responseRow = new AnalyticsResponseRow(row);
    });

    describe('constructor', () => {
        it('should not be allowed to be called without new', () => {
            expect(() => AnalyticsResponseRow()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
        });

        it('should set the row when passed as argument', () => {
            expect(responseRow).toEqual({ content: row });
        });
    });

    describe('properties', () => {
        describe('.getAt()', () => {
            it('should return the value at the given index', () => {
                expect(responseRow.getAt(1)).toEqual('201706');
            });
        });

        describe('.setIdCombination()', () => {
            it('should set the given id combination', () => {
                responseRow.setIdCombination('test-id-combination');

                expect(responseRow.idCombination).toEqual('test-id-combination');
            });
        });

        describe('.toFloat()', () => {
            it('should return the value parsed as floating point number', () => {
                expect(responseRow.toFloat(1)).toEqual(201706);
            });
        });
    });
});
