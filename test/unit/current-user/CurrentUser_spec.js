import fixtures from 'fixtures/fixtures';
import CurrentUser from 'd2/current-user/CurrentUser';
import UserAuthorities from 'd2/current-user/UserAuthorities';

describe('CurrentUser', () => {
    let currentUser;
    let userData;
    let modelDefinitions;

    beforeEach(() => {
        modelDefinitions = {
            userGroup: {
                get: stub().returns(Promise.resolve([])),
            },
            userRole: {
                get: stub().returns(Promise.resolve([])),
            },
            organisationUnit: {
                get: stub().returns(Promise.resolve([])),
            }
        };

        userData = fixtures.get('me');
        spy(UserAuthorities, 'create');
        currentUser = CurrentUser.create(userData, ['ALL'], modelDefinitions);
    });

    it('should be an instance of CurrentUser', () => {
        expect(currentUser).to.be.instanceof(CurrentUser);
    });

    it('should have an authorities property', () => {
        expect(currentUser.authorities).to.be.instanceof(UserAuthorities);
    });

    describe('create', () => {
        it('should call create on UserAuthorities with the user authorities array', () => {
            expect(UserAuthorities.create).to.be.calledWith(['ALL']);
        });
    });

    describe('properties', () => {
        it('should have set the properties from the data object', () => {
            expect(currentUser.name).to.equal('John Traore');
            expect(currentUser.jobTitle).to.equal('Super user');
        });

        it('should not override the authorities property', () => {
            currentUser = CurrentUser.create({authorities: []}, ['ALL'], modelDefinitions);
            expect(currentUser.authorities).to.be.instanceof(UserAuthorities);
        });
    });

    describe('userCredentials', () => {
        it('should set the userCredentials properties onto the currentUser object', () => {
            expect(currentUser.username).to.equal('admin');
        });

        it('should not set the userCredentials property onto the currentUser', () => {
            expect(currentUser.userCredentials).to.be.undefined;
        });

        it('should not modify the passed data object', () => {
            expect(userData.userCredentials).to.not.be.undefined;
        });

        it('should keep the created date of the orignal user object', () => {
            expect(currentUser.created).to.equal('2013-04-18T15:15:08.407+0000');
        });
    });

    describe('reference and collection properties', () => {
        it('userGroups should not exist', () => {
            expect(currentUser.userGroups).to.be.undefined;
        });

        it('userRoles should not exist', () => {
            expect(currentUser.userRoles).to.be.undefined;
        });

        it('organisationUnits should not exist', () => {
            expect(currentUser.organisationUnits).to.be.undefined;
        });

        it('dataViewOrganisationUnits should not exist', () => {
            expect(currentUser.dataViewOrganisationUnits).to.be.undefined;
        });
    });

    describe('getUserGroups', () => {
        it('should return a promise', () => {
            expect(currentUser.getUserGroups()).to.be.instanceof(Promise);
        });

        it('should be called with the userGroup ids', () => {
            currentUser.getUserGroups();

            expect(modelDefinitions.userGroup.get).to.be.calledWith({filter: ['id:in:[vAvEltyXGbD,wl5cDMuUhmF,QYrzIjSfI8z,jvrEwEJ2yZn]']})
        });
    });

    describe('getUserRoles', () => {
        it('should return a promise', () => {
            expect(currentUser.getUserRoles()).to.be.instanceof(Promise);
        });

        it('should be called with the userRole ids', () => {
            currentUser.getUserRoles();

            expect(modelDefinitions.userRole.get).to.be.calledWith({filter: ['id:in:[Ufph3mGRmMo]']})
        });
    });

    describe('getOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getOrganisationUnits()).to.be.instanceof(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getOrganisationUnits();

            expect(modelDefinitions.organisationUnit.get).to.be.calledWith({filter: ['id:in:[ImspTQPwCqd]']});
        });
    });

    describe('getDataViewOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getDataViewOrganisationUnits()).to.be.instanceof(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getDataViewOrganisationUnits();

            expect(modelDefinitions.organisationUnit.get).to.be.calledWith({filter: ['id:in:[]']});
        });
    });
});
