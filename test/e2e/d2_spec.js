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
            console.error(`D2 404: '${rq.method}', '${rq.url}'`);
        });

        server.respondWith(
            'GET',
            '/dhis/api/schemas?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType%5D',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/schemas/dataElement?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType%5D',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.dataElementSchema)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/attributes?fields=:all,optionSet%5B:all,options%5B:all%5D%5D&paging=false',
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
            '/dhis/api/me?fields=:all,organisationUnits%5Bid%5D,userGroups%5Bid%5D,userCredentials%5B:all,!user,userRoles%5Bid%5D',
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
