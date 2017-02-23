import fixtures from '../../../fixtures/fixtures';
import proxyquire from 'proxyquire';
import * as check from '../../../../src/lib/check';

const mockModelDefinitions = {};
const ModelDefinition = proxyquire
    .noCallThru()
    .load('../../../../src/model/ModelDefinition', {
        './ModelDefinitions': {
            getModelDefinitions: function () {
                return mockModelDefinitions;
            },
    },
}).default;

describe('getJSONForProperties', () => {
    describe('for legendSet', () => {
        let checkTypeStub;
        let legendSetSchema;
        let legendSet;
        let getJSONForProperties;
        let legendSetSchemaDefinition;

        beforeEach(() => {
            checkTypeStub = sinon.stub(check, 'checkType');
            checkTypeStub.returns(true);

            getJSONForProperties = require('../../../../src/model/helpers/json').getJSONForProperties;

            let legendSchema = fixtures.get('/api/schemas/legend');
            legendSetSchema = fixtures.get('/api/schemas/legendSet');
            
            legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            mockModelDefinitions.legend = ModelDefinition.createFromSchema(legendSchema);
            mockModelDefinitions.legendSet = legendSetSchemaDefinition;
            
            legendSet = fixtures.get('/api/legendSets/k1JHPfXsJND');
        });

        afterEach(() => {
            checkTypeStub.restore();
        });

        it('should embed the legends in the payload', () => {
            const model = legendSetSchemaDefinition.create(legendSet);
            
            expect(getJSONForProperties(model, ['legends']).legends).to.have.length(6);
            expect(getJSONForProperties(model, ['legends']).legends).to.deep.equal(legendSet.legends);
        });

        it('should not throw on userGroupAcceses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);
            
            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).to.have.length(1);
        });

        it('should maintain the full structure of the userGroupAccesses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);
            
            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).to.deep.equal([
                {
                    access: 'rw------',
                    userGroupUid: 'wl5cDMuUhmF',
                    displayName: 'Administrators',
                    id: 'wl5cDMuUhmF',
                },
            ]);
        });

        it('should maintain the full structure of the userAccesses', () => {
            const legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            const model = legendSetSchemaDefinition.create(legendSet);
            
            expect(getJSONForProperties(model, ['userAccesses']).userAccesses).to.deep.equal([
                {
                    access: 'rw------',
                    userUid: 'UgDpalMTGDr',
                    displayName: 'Kanu Nwankwo',
                    id: 'UgDpalMTGDr',
                },
            ]);
        });
    });
});