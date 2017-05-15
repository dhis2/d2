import ModelDefinition from '../../../../src/model/ModelDefinition';
import fixtures from '../../../fixtures/fixtures';

describe('Program defaults', () => {
    let program;

    beforeEach(() => {
        const ProgramDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/program'));
        program = ProgramDefinition.create();
    });

    it('should have `version` set to 0', () => {
        expect(program.version).to.equal(0);
    });

    it('should have `completedEventExpiryDays` set to 0', () => {
        expect(program.completeEventsExpiryDays).to.equal(0);
    });

    it('should have `expiryDays` set to 0', () => {
        expect(program.expiryDays).to.equal(0);
    });
});
