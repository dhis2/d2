import fixtures from '../../../fixtures/fixtures';
import * as check from '../../../../src/lib/check';

const mockModelDefinitions = {};

jest.mock('../../../../src/model/ModelDefinitions', () => ({
    getModelDefinitions() {
        return mockModelDefinitions;
    },
}));

const ModelDefinition = require('../../../../src/model/ModelDefinition').default;

describe('getJSONForProperties', () => {
    describe('for legendSet', () => {
        let checkTypeStub;
        let legendSetSchema;
        let legendSet;
        let getJSONForProperties;
        let legendSetSchemaDefinition;

        beforeEach(() => {
            checkTypeStub = jest.spyOn(check, 'checkType')
                .mockReturnValue(true);

            getJSONForProperties = require('../../../../src/model/helpers/json').getJSONForProperties;

            legendSetSchema = fixtures.get('/api/schemas/legendSet');

            legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            mockModelDefinitions.legendSet = legendSetSchemaDefinition;

            legendSet = fixtures.get('/api/legendSets/k1JHPfXsJND');
        });

        afterEach(() => {
            checkTypeStub.mockRestore();
        });

        it('should embed the legends in the payload', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['legends']).legends).toHaveLength(6);
            expect(getJSONForProperties(model, ['legends']).legends).toEqual(legendSet.legends);
        });

        it('should not throw on userGroupAcceses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).toHaveLength(1);
        });

        it('should maintain the full structure of the userGroupAccesses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).toEqual([
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

            expect(getJSONForProperties(model, ['userAccesses']).userAccesses).toEqual([
                {
                    access: 'rw------',
                    userUid: 'UgDpalMTGDr',
                    displayName: 'Kanu Nwankwo',
                    id: 'UgDpalMTGDr',
                },
            ]);
        });

        it('should only use the ID of the user object', () => {
            const legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            const model = legendSetSchemaDefinition.create(legendSet);

            model.user = {
                id: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
            };

            expect(getJSONForProperties(model, ['user']).user).toEqual({
                id: 'xE7jOejl9FI',
            });
        });
    });
});
