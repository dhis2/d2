import UserAuthorities from './UserAuthorities';
import UserSettings from './UserSettings';
import { noCreateAllowedFor } from '../defaultConfig';

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
        result[property] = Symbol(property); // eslint-disable-line no-param-reassign
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
                    result[propertySymbols[property]] = properties[property] // eslint-disable-line no-param-reassign
                        .map(value => value.id);
                }
            } else {
                result[property] = properties[property]; // eslint-disable-line no-param-reassign
            }
            return result;
        }, {});
}

function isInNoCreateAllowedForList(modelDefinition) {
    return modelDefinition && noCreateAllowedFor.has(modelDefinition.name);
}

export default class CurrentUser {
    constructor(userData, userAuthorities, modelDefinitions, settings) {
        Object.assign(this, getUserPropertiesToCopy(userData));

        this.authorities = userAuthorities;
        this[models] = modelDefinitions;

        /**
         * @property {UserSettings} settings Contains a reference to a `UserSettings` instance that can be used
         * to retrieve and save system settings.
         *
         * @description
         * ```js
         * d2.currentUser.userSettings.get('keyUiLocale')
         *  .then(userSettingsValue => {
         *    console.log('UI Locale: ' + userSettingsValue);
         *  });
         * ```
         */
        this.userSettings = settings;
    }

    getUserGroups() {
        const userGroupIds = this[propertySymbols.userGroups];

        return this[models].userGroup.get({ filter: [`id:in:[${userGroupIds.join(',')}]`] });
    }

    getUserRoles() {
        const userRoleIds = this[propertySymbols.userRoles];

        return this[models].userRole.get({ filter: [`id:in:[${userRoleIds.join(',')}]`] });
    }

    getOrganisationUnits(listOptions = { fields: ':all,displayName,children[id,displayName,path,children::isNotEmpty]' }) {
        const organisationUnitsIds = this[propertySymbols.organisationUnits];

        return this[models].organisationUnit.list(
            Object.assign({}, listOptions, { filter: [`id:in:[${organisationUnitsIds.join(',')}]`] })
        );
    }

    getDataViewOrganisationUnits(listOptions = { fields: ':all,displayName,children[id,displayName,path,children::isNotEmpty]' }) {
        const organisationUnitsIds = this[propertySymbols.dataViewOrganisationUnits];

        return this[models].organisationUnit.list(
            Object.assign({}, listOptions, { filter: [`id:in:[${organisationUnitsIds.join(',')}]`] })
        );
    }

    checkAuthorityForType(authorityType, modelType) {
        if (!modelType || !Array.isArray(modelType.authorities)) {
            return false;
        }

        return modelType.authorities
            // Filter the correct authority to check for from the model
            .filter(authority => authorityType.some(authToHave => authToHave === authority.type))
            // Check the left over schema authority types
            .some(schemaAuthority => schemaAuthority.authorities
                .some(authorityToCheckFor => this.authorities.has(authorityToCheckFor)) // Check if one of the schema authorities are available in the users authorities
            );
    }

    checkCreateAuthorityForType(authType, modelType) {
        // When the modelType is mentioned in the the list of modelTypes that are not
        // allowed to be created we return false
        if (isInNoCreateAllowedForList(modelType)) {
            return false;
        }

        // Otherwise we check using the normal procedure for checking authorities
        return this.checkAuthorityForType(authType, modelType);
    }

    canCreate(modelType) {
        return this.checkCreateAuthorityForType(authTypes.CREATE, modelType);
    }

    canCreatePublic(modelType) {
        return this.checkCreateAuthorityForType(authTypes.CREATE_PUBLIC, modelType);
    }

    canCreatePrivate(modelType) {
        return this.checkCreateAuthorityForType(authTypes.CREATE_PRIVATE, modelType);
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
        return new CurrentUser(userData, UserAuthorities.create(authorities), modelDefinitions, new UserSettings());
    }
}
