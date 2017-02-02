import ModelDefinition from '../../../../src/model/ModelDefinition';
import fixtures from '../../../fixtures/fixtures';

describe('ValidationRule defaults', () => {
    let validationRule;

    beforeEach(() => {
    const ValidationRuleDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/validationRule'));
        validationRule = ValidationRuleDefinition.create();
    });

    it('should have `importance` set to `MEDIUM`', () => {
        expect(validationRule.importance).to.equal('MEDIUM');
    });

    it('should have `periodType` set to `Monthly`', () => {
        expect(validationRule.periodType).to.equal('Monthly');
    });

    it('should have `operator` set to `not_equal_to`', () => {
        expect(validationRule.operator).to.equal('not_equal_to')
    });

    it('should have `leftSide` set to the correct values', () => {
        const correctValues = {
            missingValueStrategy: "NEVER_SKIP",
            description: "",
            expression: "",
        };

        expect(validationRule.leftSide).to.deep.equal(correctValues);
    });

    it('should have `rightSide` set to the correct values', () => {
        const correctValues = {
            missingValueStrategy: "NEVER_SKIP",
            description: "",
            expression: "",
        };

        expect(validationRule.rightSide).to.deep.equal(correctValues);
    });
});
