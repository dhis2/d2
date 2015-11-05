import UserAuthorities from './UserAuthorities';

const models = Symbol('models');
const propertiesToIgnore = new Set([
    'userCredentials',
    'userGroups',
    'userRoles',
    'organisationUnits',
    'dataViewOrganisationUnits',
]);

const authTypes = {
    READ: ['READ'],
    CREATE: ['CREATE', 'CREATE_PUBLIC', 'CREATE_PRIVATE'],
    CREATE_PUBLIC: ['CREATE_PUBLIC'],
    CREATE_PRIVATE: ['CREATE_PRIVATE'],
    DELETE: ['DELETE'],
    UPDATE: ['UPDATE'],
    EXTERNALIZE: ['EXTERNALIZE'],
};

const propertySymbols = Array
    .from(propertiesToIgnore)
    .reduce((result, property) => {
        result[property] = Symbol(property);
        return result;
    }, {});

function getUserPropertiesToCopy(currentUserObject) {
    let properties;
    // The user credentials object is confusing so we set the properties straight onto the current user
    if (currentUserObject.userCredentials) {
        properties = Object.assign({}, currentUserObject.userCredentials, currentUserObject);
    } else {
        properties = Object.assign({}, currentUserObject);
    }

    return Object.keys(properties)
        .reduce((result, property) => {
            if (propertiesToIgnore.has(property)) {
                if (properties[property].map) {
                    result[propertySymbols[property]] = properties[property]
                        .map(value => value.id);
                }
            } else {
                result[property] = properties[property];
            }
            return result;
        }, {});
}

export default class CurrentUser {
    constructor(userData, userAuthorities, modelDefinitions) {
        Object.assign(this, getUserPropertiesToCopy(userData));

        this.authorities = userAuthorities;
        this[models] = modelDefinitions;
    }

    getUserGroups() {
        const userGroupIds = this[propertySymbols.userGroups];

        return this[models].userGroup.get({filter: [`id:in:[${userGroupIds.join(',')}]`]});
    }

    getUserRoles() {
        const userRoleIds = this[propertySymbols.userRoles];

        return this[models].userRole.get({filter: [`id:in:[${userRoleIds.join(',')}]`]});
    }

    getOrganisationUnits() {
        const organisationUnitsIds = this[propertySymbols.organisationUnits];

        return this[models].organisationUnit.list({filter: [`id:in:[${organisationUnitsIds.join(',')}]`]});
    }

    getDataViewOrganisationUnits() {
        const organisationUnitsIds = this[propertySymbols.dataViewOrganisationUnits];

        return this[models].organisationUnit.list({filter: [`id:in:[${organisationUnitsIds.join(',')}]`]});
    }

    checkAuthorityForType(authorityType, modelType) {
        if (!modelType || !Array.isArray(modelType.authorities)) {
            return false;
        }

        return modelType.authorities
            // Filter the correct authority to check for from the model
            .filter(authority => authorityType.some(authToHave => authToHave === authority.type))
            // Check the left over schema authority types
            .some(schemaAuthority => {
                // Check if one of the schema authorities are available in the users authorities
                return schemaAuthority.authorities
                    .some(authorityToCheckFor => this.authorities.has(authorityToCheckFor));
            });
    }

    canCreate(modelType) {
        return this.checkAuthorityForType(authTypes.CREATE, modelType);
    }

    canCreatePublic(modelType) {
        return this.checkAuthorityForType(authTypes.CREATE_PUBLIC, modelType);
    }

    canCreatePrivate(modelType) {
        return this.checkAuthorityForType(authTypes.CREATE_PRIVATE, modelType);
    }

    canDelete(modelType) {
        return this.checkAuthorityForType(authTypes.DELETE, modelType);
    }

    canUpdate(modelType) {
        if (this.checkAuthorityForType(authTypes.UPDATE, modelType)) {
            return true;
        }
        return this.checkAuthorityForType(authTypes.CREATE, modelType);
    }

    get uiLocale() {
        if (this.userSettings && this.userSettings.keyUiLocale) {
            return this.userSettings.keyUiLocale;
        }
        return 'en';
    }

    static create(userData, authorities, modelDefinitions) {
        return new CurrentUser(userData, UserAuthorities.create(authorities), modelDefinitions);
    }
}
