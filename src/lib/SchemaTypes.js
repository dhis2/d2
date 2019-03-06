import { throwError } from './utils'
import { isString } from './check'

const getTypes = () => [
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
]

const typeLookup = propertyType => {
    if (getTypes().indexOf(propertyType) >= 0 && isString(propertyType)) {
        return propertyType
    }

    const message = [
        'Type from schema "',
        propertyType,
        '" not found available type list.',
    ].join('')

    return throwError(message)
}

const SchemaTypes = {
    getTypes,
    typeLookup,
}

export default SchemaTypes
