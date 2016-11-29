import {init, getInstance} from '../../../src/d2';
import { respondTo, createFetchMock } from '../../setup/fetch-mock';
import { createSpies } from '../../setup/setup-d2-init-requests';

describe('D2.system', function () {
    let d2;

    beforeEach(function (done) {
        createFetchMock();
        createSpies();

        init({baseUrl: '/dhis/api'});
        getInstance()
            .then(function (initialisedD2) {
                d2 = initialisedD2;
                done();
            });
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it('should be available on the d2 object', () => {
        expect(d2.system).to.not.be.undefined;
    });

    describe('settings', () => {
        let systemSettings;

        beforeEach(() => {
            systemSettings = d2.system.settings;
            
            respondTo('/dhis/api/systemSettings/keyLastSuccessfulResourceTablesUpdate')
                .with('Sun Mar 15 00:00:00 CET 2015', {'Content-Type': 'text/plain'});

            respondTo('/dhis/api/systemSettings/keySystemSettingsJson')
                .with('{"dataKey": "DataValue"}', {'Content-Type': 'text/plain'});

            respondTo('/dhis/api/systemSettings')
                .with(JSON.stringify({
                    keySystemSettingsJson: {dataKey: 'DataValue'},
                    keyLastSuccessfulResourceTablesUpdate: 'Sun Mar 15 00:00:00 CET 2015'
            }));
        });

        it('should be available on the system object', () => {
            expect(systemSettings).to.not.be.undefined;
        });

        it('should return the requested plain/text value', () => {
            return systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then(systemSettingValue => {
                    expect(systemSettingValue).to.equal('Sun Mar 15 00:00:00 CET 2015');
                });
        });

        it('should return the requested value as json', () => {
            return systemSettings.get('keySystemSettingsJson')
                .then(systemSettingValue => {
                    expect(systemSettingValue.dataKey).to.equal('DataValue');
                })
        });

        it('should return the settings object when all system settings are requested', () => {
            let expectedSystemSettings = {
                keySystemSettingsJson: {dataKey: 'DataValue'},
                keyLastSuccessfulResourceTablesUpdate: 'Sun Mar 15 00:00:00 CET 2015'
            };

            return systemSettings.all()
                .then(returnedSystemSettings => {
                    expect(returnedSystemSettings).to.deep.equal(expectedSystemSettings);
                });
        });
    });
});
