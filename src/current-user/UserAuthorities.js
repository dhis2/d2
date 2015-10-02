const auths = Symbol();

export default class UserAuthorities {
    constructor(authorities = []) {
        this[auths] = new Set(authorities);
    }

    has(authority) {
        if (this[auths].has('ALL')) {
            return true;
        }
        return this[auths].has(authority);
    }

    static create(authorities) {
        return new UserAuthorities(authorities);
    }
}
