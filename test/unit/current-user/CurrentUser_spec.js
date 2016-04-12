import fixtures from '../../fixtures/fixtures';
import CurrentUser from '../../../src/current-user/CurrentUser';
import UserAuthorities from '../../../src/current-user/UserAuthorities';

describe('CurrentUser', () => {
    let currentUser;
    let userData;
    let modelDefinitions;
    let mockUserAuthorities;

    beforeEach(() => {
        modelDefinitions = {
            userGroup: {
                get: stub().returns(Promise.resolve([])),
                authorities: [{ type: 'CREATE_PUBLIC', authorities: ['F_USERGROUP_PUBLIC_ADD'] }]
            },
            userRole: {
                get: stub().returns(Promise.resolve([])),
            },
            organisationUnit: {
                list: stub().returns(Promise.resolve([])),
                authorities: [
                    {
                        type: 'CREATE',
                        authorities: [
                            'F_ORGANISATIONUNIT_ADD',
                        ],
                    }, {
                        type: 'DELETE',
                        authorities: [
                            'F_ORGANISATIONUNIT_DELETE',
                        ],
                    },
                ],
            },
            organisationUnitLevel: {
                authorities: [{ type: 'UPDATE', authorities: ['F_ORGANISATIONUNITLEVEL_UPDATE'] }]
            },
        };

        userData = fixtures.get('me');
        spy(UserAuthorities, 'create');
        mockUserAuthorities = [
            'F_ORGANISATIONUNIT_ADD',
            'F_ORGANISATIONUNIT_DELETE',
            'F_ORGANISATIONUNITLEVEL_UPDATE',
            'F_USERGROUP_PUBLIC_ADD',
        ];
        currentUser = CurrentUser.create(userData, mockUserAuthorities, modelDefinitions);
    });

    it('should be an instance of CurrentUser', () => {
        expect(currentUser).to.be.instanceof(CurrentUser);
    });

    it('should have an authorities property', () => {
        expect(currentUser.authorities).to.be.instanceof(UserAuthorities);
    });

    describe('create', () => {
        it('should call create on UserAuthorities with the user authorities array', () => {
            expect(UserAuthorities.create).to.be.calledWith(mockUserAuthorities);
        });
    });

    describe('properties', () => {
        it('should have set the properties from the data object', () => {
            expect(currentUser.name).to.equal('John Traore');
            expect(currentUser.jobTitle).to.equal('Super user');
        });

        it('should not override the authorities property', () => {
            currentUser = CurrentUser.create({ authorities: [] }, ['ALL'], modelDefinitions);
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

            expect(modelDefinitions.userGroup.get).to.be.calledWith({ filter: ['id:in:[vAvEltyXGbD,wl5cDMuUhmF,QYrzIjSfI8z,jvrEwEJ2yZn]'] });
        });
    });

    describe('getUserRoles', () => {
        it('should return a promise', () => {
            expect(currentUser.getUserRoles()).to.be.instanceof(Promise);
        });

        it('should be called with the userRole ids', () => {
            currentUser.getUserRoles();

            expect(modelDefinitions.userRole.get).to.be.calledWith({ filter: ['id:in:[Ufph3mGRmMo]'] });
        });
    });

    describe('getOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getOrganisationUnits()).to.be.instanceof(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getOrganisationUnits();

            expect(modelDefinitions.organisationUnit.list).to.be.calledWith({ fields: ':all,displayName,children[id,displayName,path]', filter: ['id:in:[ImspTQPwCqd]'] });
        });
    });

    describe('getDataViewOrganisationUnits', () => {
        it('should return a promise', () => {
            expect(currentUser.getDataViewOrganisationUnits()).to.be.instanceof(Promise);
        });

        it('should be called with organisationUnit ids', () => {
            currentUser.getDataViewOrganisationUnits();

            expect(modelDefinitions.organisationUnit.list).to.be.calledWith({ fields: ':all,displayName,children[id,displayName,path]', filter: ['id:in:[]'] });
        });
    });

    describe('canCreate', () => {
        it('should return false if the no model is passed', () => {
            expect(currentUser.canCreate()).to.equal(false);
        });

        it('should return false for userRole', () => {
            expect(currentUser.canCreate(modelDefinitions.userRole)).to.be.false;
        });

        it('should return true for organisationUnit', () => {
            expect(currentUser.canCreate(modelDefinitions.organisationUnit)).to.be.true;
        });

        it('should return for userGroup', () => {
            expect(currentUser.canCreate(modelDefinitions.userGroup)).to.be.true;
        });
    });

    describe('canDelete', () => {
        it('should return false if the no model is passed', () => {
            expect(currentUser.canDelete()).to.equal(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canDelete(modelDefinitions.userGroup)).to.be.false;
        });

        it('should return true for organisationUnit', () => {
            expect(currentUser.canDelete(modelDefinitions.organisationUnit)).to.be.true;
        });
    });

    describe('canUpdate', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canUpdate()).to.equal(false);
        });

        it('should return false for userRole', () => {
            expect(currentUser.canCreate(modelDefinitions.userRole)).to.be.false;
        });

        it('should return true for userGroup', () => {
            expect(currentUser.canUpdate(modelDefinitions.userGroup)).to.be.true;
        });

        it('should return true for organisationUnitLevel', () => {
            expect(currentUser.canUpdate(modelDefinitions.organisationUnitLevel)).to.be.true;
        });
    });

    describe('canCreatePublic', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canCreatePublic()).to.equal(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canCreatePublic(modelDefinitions.userGroup)).to.be.true;
        });
    });

    describe('canCreatePrivate', () => {
        it('should return false if no model is passed', () => {
            expect(currentUser.canCreatePrivate()).to.equal(false);
        });

        it('should return false for userGroup', () => {
            expect(currentUser.canCreatePrivate(modelDefinitions.userGroup)).to.be.false;
        });
    });

    describe('uiLocale', () => {
        it('should return the default uiLocale for the user', () => {
            expect(currentUser.uiLocale).to.equal('en');
        });

        it('should return the set ui locale from the userSettings', () => {
            currentUser.userSettings = {
                keyUiLocale: 'fr',
            };

            expect(currentUser.uiLocale).to.equal('fr');
        });
    });
});
