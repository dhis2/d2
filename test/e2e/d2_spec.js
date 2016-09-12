import d2 from '../../src/d2';

describe('D2', function () {
    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        // Show the requests made to the fake server.
        // server.xhr.addFilter(function (method, url) {
        //    console.log(method, url);
        //    return false;
        // });

        server.respondWith(/(.*)/, (rq) => {
            console.error(`404: '${rq.method}', '${rq.url}'`);
        });

        server.respondWith(
            'GET',
            '/dhis/api/schemas?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType]',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/schemas/dataElement?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType]',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.dataElementSchema)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/attributes?fields=:all,optionSet[:all,options[:all]]&paging=false',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({attributes: []})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\/authorization$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify([])
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\?fields=%3Aall%2CorganisationUnits%5Bid%5D%2CuserGroups%5Bid%5D%2CuserCredentials%5B%3Aall%2C!user%2CuserRoles%5Bid%5D$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/userSettings$/,
            [
                200,
                {'Content-Type': 'application/json'},
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
                })
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/system\/info$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({version: '2.21'})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/apps$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({apps: []})
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/me?fields=:all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id]',
            [
                200,
                {'Content-Type': 'text/plain'},
                '{}'
            ]
        );

        server.respondWith(() => {
            [
                404,
                {'Content-Type': 'text/plain'},
                'Resource not found'
            ]
        });
    });

    it('should be available on the window', function (done) {
        d2.init({ baseUrl: '/dhis/api' })
            .then(function (initialisedD2) {
                expect(initialisedD2).to.not.be.undefined;
                done();
            })
            .catch(done);
    });

    it('should only load the requested schemas', function (done) {
        d2.init({ baseUrl: '/dhis/api', schemas: ['dataElement'] })
            .then(function (initialisedD2) {
                expect(initialisedD2.models.dataElement).to.not.be.undefined;
                expect(initialisedD2.models.indicator).to.be.undefined;
                done();
            })
            .catch(done);
    });
});
