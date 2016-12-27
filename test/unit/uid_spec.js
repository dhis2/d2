import { isValidUid, generateUid } from '../../src/uid';
import { range } from 'lodash';

describe('Uid generation', () => {
    describe('isValidUid()', () => {
        it('should be a function', () => {
            expect(isValidUid).to.be.a('function');
        });

        it('should return false for undefined', () => {
            expect(isValidUid()).to.be.false;
        });
        
        it('should return false for null', () => {
            expect(isValidUid(null)).to.be.false;
        });

        it('should return false for 0', () => {
            expect(isValidUid(0)).to.be.false;
        });

        it('should return false for empty string', () => {
            expect(isValidUid('')).to.be.false;
        });
        
        it('should return false for a uid that is shorter than 11 characters', () => {
            expect(isValidUid('a1234')).to.be.false;
        });

        it('should return true for a valid uid', () => {
            expect(isValidUid('JkWynlWMjJR')).to.be.true;
        });

        it('should return false for a uid that starts with a number', () => {
            expect(isValidUid('0kWynlWMjJR')).to.be.false;
        });

        it('should return false for a uid that has a special character', () => {
            expect(isValidUid('AkWy$lWMjJR')).to.be.false;
        });
    });

    describe('generateUid', () => {
        it('should generate a uid that is 11 characters long', () => {
            expect(generateUid()).to.have.length(11);
        });

        it('should generate a uid that starts with a letter', () => {
            expect(generateUid()).to.match(/^[A-z]{1}/);
        });

        it('should not generate the same uids', () => {
            expect(generateUid()).to.not.equal(generateUid());
        });

        it('should generate a lot of unique codes', () => {
            const generate500UniqueCodes = () => range(0, 500)
                .map(() => generateUid())
                .reduce((codes, code) => codes.add(code), new Set());
                
            expect(generate500UniqueCodes).not.to.throw();
        });
    });
});