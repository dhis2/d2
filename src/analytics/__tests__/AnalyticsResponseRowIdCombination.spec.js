import AnalyticsResponseRowIdCombination from '../AnalyticsResponseRowIdCombination';

let responseRowIdCombination;
const rowIdCombination = ['id1', 'id2', 'id3', 'id4', 'id5'];

describe('AnalyticsResponseRowIdCombination', () => {
    beforeEach(() => {
        responseRowIdCombination = new AnalyticsResponseRowIdCombination(rowIdCombination);
    });

    describe('constructor', () => {
        it('should not be allowed to be called without new', () => {
            expect(() => AnalyticsResponseRowIdCombination()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
        });

        it('should set the rowIdCombination when passed as argument', () => {
            expect(responseRowIdCombination.ids).toEqual(rowIdCombination.join('-'));
        });
    });

    describe('properties', () => {
        describe('.add()', () => {
            it('should append the given value at the ids string', () => {
                responseRowIdCombination.add('id6');

                expect(responseRowIdCombination.ids).toEqual([...rowIdCombination, 'id6'].join('-'));
            });
        });

        describe('.get()', () => {
            it('should return the ids string', () => {
                expect(responseRowIdCombination.get()).toEqual(rowIdCombination.join('-'));
            });
        });

        describe('.getIdByIds()', () => {
            it('should return the first id of the given list that is present in the object', () => {
                responseRowIdCombination.getIdByIds(['id3', 'id1']);

                expect(responseRowIdCombination.getIdByIds(['id3', 'id1'])).toEqual('id1');
            });
        });
    });
});
