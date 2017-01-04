import d2 from '../../src/d2';
import { respondTo, createFetchMock } from '../setup/fetch-mock';
import { createSpies } from '../setup/setup-d2-init-requests';

describe.only('D2', function () {
    beforeEach(() => {
        createFetchMock();
        createSpies();
    });

    afterEach(() => {
        window.fetch.restore();
    });

    it('should call all http requests', () => {
        return d2.init({ baseUrl: '/dhis/api' })
            .then(() => {
                expect(fetch.requests.requestTo('/dhis/api/schemas?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType%5D')).to.have.callCount(1);
                expect(fetch.requests.requestTo('/dhis/api/userSettings')).to.have.callCount(1);
            });
    });

    it('should be available on the window', function () {
        return d2.init({ baseUrl: '/dhis/api' })
            .then(function (initialisedD2) {
                expect(initialisedD2).to.not.be.undefined;
            });
    });

    it('should only load the requested schemas', function () {
        return d2.init({ baseUrl: '/dhis/api', schemas: ['dataElement'] })
            .then(function (initialisedD2) {
                expect(initialisedD2.models.dataElement).to.not.be.undefined;
                expect(initialisedD2.models.indicator).to.be.undefined;
            });
    });
});
