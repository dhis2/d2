import UserAuthorities from 'd2/current-user/UserAuthorities';

const models = Symbol('models');
const propertiesToIgnore = new Set([
    'userCredentials',
    'userGroups',
    'userRoles',
    'organisationUnits',
    'dataViewOrganisationUnits',
]);

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

        return this[models].organisationUnit.get({filter: [`id:in:[${organisationUnitsIds.join(',')}]`]});
    }

    getDataViewOrganisationUnits() {
        const organisationUnitsIds = this[propertySymbols.dataViewOrganisationUnits];

        return this[models].organisationUnit.get({filter: [`id:in:[${organisationUnitsIds.join(',')}]`]});
    }

    static create(userData, authorities, modelDefinitions) {
        return new CurrentUser(userData, UserAuthorities.create(authorities), modelDefinitions);
    }
}
