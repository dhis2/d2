import fixtures from '../../fixtures/fixtures';
import UserAuthorities from '../../../src/current-user/UserAuthorities';

describe('UserAuthorities', () => {
    let authorities;
    let userAuthorities;

    beforeEach(() => {
        authorities = fixtures.get('me/authorities');

        userAuthorities = UserAuthorities.create(authorities);
    });

    it('should return true if the user has an authority', () => {
        expect(userAuthorities.has('F_DATAVALUE_DELETE')).to.equal(true);
    });

    it('should return false if the user does not have an authority', () => {
        expect(userAuthorities.has('F_DOCUMENT_PUBLIC_DELETE')).equal(false);
    });

    it('should return true if the user does not have an authority but does have ALL', () => {
        userAuthorities = UserAuthorities.create(['F_DATAVALUE_DELETE', 'ALL']);

        expect(userAuthorities.has('F_DOCUMENT_PUBLIC_DELETE')).equal(true);
    });

    it('should return false when asking for ALL and the user does not have it', () => {
        expect(userAuthorities.has('ALL')).equals(false);
    });

    it('should return true when asking for ALL and the user has the authority', () => {
        userAuthorities = UserAuthorities.create(['F_DATAVALUE_DELETE', 'ALL']);

        expect(userAuthorities.has('ALL')).equals(true);
    });
});
