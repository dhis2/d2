import {throwError} from 'd2/lib/utils';
import {isString} from 'd2/lib/check';

class SchemaTypes {
    getTypes() {
        return [
            'TEXT',
            'NUMBER',
            'INTEGER',
            'BOOLEAN',
            'EMAIL',
            'PASSWORD',
            'URL',
            'PHONENUMBER',
            'GEOLOCATION', //TODO: Geo location could be an advanced type of 2 numbers / strings?
            'COLOR',
            'COMPLEX',
            'COLLECTION',
            'REFERENCE',
            'DATE',
            'COMPLEX',
            'IDENTIFIER',
            'CONSTANT'
        ];
    }

    typeLookup(propertyType) {
        if (this.getTypes().indexOf(propertyType) >= 0 &&
            isString(propertyType)) {

            return propertyType;
        }
        throwError(['Type from schema "', propertyType, '" not found available type list.'].join(''));
    }
}

export default new SchemaTypes();
