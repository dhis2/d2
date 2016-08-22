import {init, getInstance} from '../../../src/d2';

describe('D2.system', function () {
    let server;
    let d2;

    beforeEach(function (done) {
        server = sinon.fakeServer.create();

        server.respondWith(
            'GET',
            '/dhis/api/schemas?fields=apiEndpoint%2Cname%2Cauthorities%2Cplural%2Cshareable%2Cmetadata%2Cklass%2CidentifiableObject%2Cproperties%5Bhref%2Cwritable%2Ccollection%2CcollectionName%2Cname%2CpropertyType%2Cpersisted%2Crequired%2Cmin%2Cmax%2Cordered%2Cunique%2Cconstants%2Cowner%2CitemPropertyType%5D',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/attributes\?fields=%3Aall%2CoptionSet%5B%3Aall%2Coptions%5B%3Aall%5D%5D&paging=false$/,
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
                JSON.stringify({keyUiLocale:'en'})
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

        init({baseUrl: '/dhis/api'});
        getInstance()
            .then(function (initialisedD2) {
                d2 = initialisedD2;
                done();
            });

        server.respond();
    });

    afterEach(() => {
        server.restore();
    });

    it('should be available on the d2 object', () => {
        expect(d2.system).to.not.be.undefined;
    });

    describe('settings', () => {
        let systemSettings;

        beforeEach(() => {
            systemSettings = d2.system.settings;
            server.respondWith(
                'GET',
                '/dhis/api/systemSettings/keyLastSuccessfulResourceTablesUpdate',
                [
                    200,
                    {'Content-Type': 'text/plain'},
                    'Sun Mar 15 00:00:00 CET 2015'
                ]
            );

            server.respondWith(
                'GET',
                '/dhis/api/systemSettings/keySystemSettingsJson',
                [
                    200,
                    {'Content-Type': 'text/plain'},
                    '{"dataKey": "DataValue"}'
                ]
            );

            server.respondWith(
                'GET',
                '/dhis/api/systemSettings',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({
                        keySystemSettingsJson: {dataKey: 'DataValue'},
                        keyLastSuccessfulResourceTablesUpdate: 'Sun Mar 15 00:00:00 CET 2015'
                    })
                ]
            );
        });

        it('should be available on the system object', () => {
            expect(systemSettings).to.not.be.undefined;
        });

        it('should return the requested plain/text value', (done) => {
            systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then(systemSettingValue => {
                    expect(systemSettingValue).to.equal('Sun Mar 15 00:00:00 CET 2015');
                })
                .then(done);

            server.respond();
        });

        it('should return the requested value as json', (done) => {
            systemSettings.get('keySystemSettingsJson')
                .then(systemSettingValue => {
                    expect(systemSettingValue.dataKey).to.equal('DataValue');
                })
                .then(done);

            server.respond();
        });

        it('should return the settings object when all system settings are requested', (done) => {
            let expectedSystemSettings = {
                keySystemSettingsJson: {dataKey: 'DataValue'},
                keyLastSuccessfulResourceTablesUpdate: 'Sun Mar 15 00:00:00 CET 2015'
            };

            systemSettings.all()
                .then(returnedSystemSettings => {
                    expect(returnedSystemSettings).to.deep.equal(expectedSystemSettings);
                })
                .then(done);

            server.respond();
        });
    });
});
