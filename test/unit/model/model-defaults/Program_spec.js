import ModelDefinition from '../../../../src/model/ModelDefinition';
import fixtures from '../../../fixtures/fixtures';

describe('Program defaults', () => {
    let program;

    beforeEach(() => {
        const ProgramDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/program'));
        program = ProgramDefinition.create();
    });

    it('should have `version` set to 0', () => {
        expect(program.version).toBe(0);
    });

    it('should have `completedEventExpiryDays` set to 0', () => {
        expect(program.completeEventsExpiryDays).toBe(0);
    });

    it('should have `expiryDays` set to 0', () => {
        expect(program.expiryDays).toBe(0);
    });
});
