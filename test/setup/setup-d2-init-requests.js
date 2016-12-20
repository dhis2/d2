import { respondTo } from './fetch-mock';

export function createSpies() {    
    const schemasRequest = respondTo('/dhis/api/schemas?fields=apiEndpoint,name,displayName,authorities,singular,plural,shareable,metadata,klass,identifiableObject,translatable,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType,translationKey%5D')
        .with(
            JSON.stringify(window.fixtures.schemas), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const dataElementSchemasRequest = respondTo('/dhis/api/schemas/dataElement?fields=apiEndpoint,name,displayName,authorities,singular,plural,shareable,metadata,klass,identifiableObject,translatable,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType,translationKey%5D')
        .with(
            JSON.stringify(window.fixtures.dataElementSchema), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const attributesRequest = respondTo('/dhis/api/attributes?fields=:all,optionSet%5B:all,options%5B:all%5D%5D&paging=false')
        .with(
            JSON.stringify({ attributes: [] }), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const authorizationRequest = respondTo('/dhis/api/me/authorization')
        .with(
            JSON.stringify([]), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const userSettingsRequest = respondTo('/dhis/api/userSettings')
        .with(
            JSON.stringify({
                "keyDbLocale": "en",
                "keyMessageSmsNotification": true,
                "keyTrackerDashboardLayout": null,
                "keyStyle": "light_blue/light_blue.css",
                "keyAutoSaveDataEntryForm": false,
                "keyUiLocale": "fr",
                "keyAutoSavetTrackedEntityForm": false,
                "keyAnalysisDisplayProperty": "name",
                "keyAutoSaveCaseEntryForm": false,
                "keyMessageEmailNotification": true
            }), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const infoRequest = respondTo('/dhis/api/system/info')
        .with(
            JSON.stringify({ version: '2.21' }), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });


    const appsRequest = respondTo('/dhis/api/apps')
        .with(
            JSON.stringify({ apps: [] }), {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    const meRequest = respondTo('/dhis/api/me?fields=:all,organisationUnits%5Bid%5D,userGroups%5Bid%5D,userCredentials%5B:all,!user,userRoles%5Bid%5D')
        .with(
            '{}', {
                status: 200,
                headers: {
                    'Content-type': 'application/json'
                }
            });

    return {
        schemasRequest,
        dataElementSchemasRequest,
        attributesRequest,
        authorizationRequest,
        userSettingsRequest,
        infoRequest,
        appsRequest,
        meRequest,
    };
}
