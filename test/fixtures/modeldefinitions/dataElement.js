window.fixtures.add(
    'modelDefinitions/dataElement',
    {
        "name": "dataElement",
        "isMetaData": true,
        "apiEndpoint": "/dataElements",
        "modelProperties": {
            "aggregationLevels": {
                "propertyDescriptor": {
                    "enumerable": true,
                    "writable": true,
                    "configurable": false
                }, "persisted": true, "required": false, "owner": true
            },
            "zeroIsSignificant": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "boolean",
                "required": true,
                "owner": true
            },
            "dimensionType": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "required": true,
                "owner": false
            },
            "type": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": true,
                "owner": true
            },
            "optionSet": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "id": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "created": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "description": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "commentOptionSet": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "name": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": true,
                "owner": true
            },
            "externalAccess": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "type": "boolean",
                "required": true,
                "owner": false
            },
            "textType": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "href": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "type": "string",
                "required": true,
                "owner": false
            },
            "dataElementGroups": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": false
            },
            "publicAccess": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "aggregationOperator": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": true,
                "owner": true
            },
            "formName": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "lastUpdated": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "dataSets": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": false
            },
            "code": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "access": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "required": true,
                "owner": false
            },
            "url": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "numberType": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": false,
                "owner": true
            },
            "domainType": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": true,
                "owner": true
            },
            "legendSet": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "categoryCombo": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "dimension": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "type": "string",
                "required": true,
                "owner": false
            },
            "attributeValues": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "items": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "required": true,
                "owner": false
            },
            "userGroupAccesses": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "shortName": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "type": "string",
                "required": true,
                "owner": true
            },
            "displayName": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "type": "string",
                "required": true,
                "owner": false
            },
            "user": {
                "propertyDescriptor": {"enumerable": true, "writable": true, "configurable": false},
                "persisted": true,
                "required": false,
                "owner": true
            },
            "filter": {
                "propertyDescriptor": {"enumerable": true, "writable": false, "configurable": false},
                "persisted": false,
                "type": "string",
                "required": true,
                "owner": false
            }
        }
    }
);