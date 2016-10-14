/* global describe, it, expect */
import Attributes from '../../../../src/model/attributes/Attributes';
import fixtures from '../../../fixtures/fixtures';

describe('Attributes', () => {
    let attributes;

    beforeEach(() => {
        attributes = new Attributes(fixtures.get('/api/attributes'));
    });

    it('should create an Attributes object', () => {
        expect(new Attributes).to.be.instanceof(Attributes);
    });

    it('should use the attributes from an array when an array was passed', () => {
        const attributesFromArray = new Attributes(fixtures.get('/api/attributes').attributes);

        expect(attributes.attributes).to.deep.equal(attributesFromArray.attributes);
    });

    describe('attributes property', () => {
        it('should return an array of attributes', () => {
            expect(attributes.attributes).to.deep.equal(fixtures.get('/api/attributes').attributes);
        });

        it('should not be allowed to set to the attribute property', () => {
            const shouldThrow = () => {
                attributes.attributes = [];
            };

            expect(shouldThrow).to.throw();
        });
    });

    describe('getAttributesForSchema', () => {
        it('should be a method', () => {
            expect(attributes.getAttributesForSchema).to.be.a('function');
        });

        it('should return the correct attributes for a schema', () => {
            const dataElementSchemaMock = {
                singular: 'dataElement',
            };

            expect(attributes.getAttributesForSchema(dataElementSchemaMock)).to.deep.equal(fixtures.get('/dataElementAttributes'));
        });
    });
});
