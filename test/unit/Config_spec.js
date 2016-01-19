import Config from '../../src/config';

describe('Config', () => {
    it('should not be allowed to call as function', () => {
        expect(() => Config()).to.throw();  // eslint-disable-line
    });
});
