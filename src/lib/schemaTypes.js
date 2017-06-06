import { isString } from './check';

/**
 * @description
 * The types of values as there are defined on the DHIS2 schemas. These types can be used to run value validation
 * or determine what type of input to show for a value of such a type.
 *
 * @type {Set}
 */
export const schemaTypes = new Set([
    'TEXT',
    'NUMBER',
    'INTEGER',
    'BOOLEAN',
    'EMAIL',
    'PASSWORD',
    'URL',
    'PHONENUMBER',
    'GEOLOCATION', // TODO: Geo location could be an advanced type of 2 numbers / strings?
    'COLOR',
    'COMPLEX',
    'COLLECTION',
    'REFERENCE',
    'DATE',
    'COMPLEX',
    'IDENTIFIER',
    'CONSTANT',
]);

// TODO: Check what the relevance is of doing this is at all?
/**
 * Matches the given propertyType against a set of valid schemaTypes.
 *
 * @param {string} propertyType The type as specified on the schema property.
 * @returns {string} Returns the passed in propertyType
 *
 * @throws {Error} Throws an error when a type can not be found in the schemaTypes set.
 *
 * @example
 * typeLookup('TEXT') // 'TEXT'
 * typeLookup('ONLY_DOLLARS') // throws
 */
export function typeLookup(propertyType) {
    if (isString(propertyType) && schemaTypes.has(propertyType)) {
        return propertyType;
    }

    throw new Error(`Type from schema "${propertyType}" not found available type list.`);
}
