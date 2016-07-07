# D2 Changelog

## 24.0.12
###### _July 7th 2016_

##### Changed

- [fix] Stand alone builds. `d2-browser.js` and `d2-browser.min.js` now correctly export a `d2` global.

## 24.0.11
###### _June 27th 2016_

##### Changed

- [feat] With the `/api/24/schemas` endpoint not updating the `apiEndpoint` hrefs to the version of the api being used, we patch the urls before using them. `apiEndpoint: '/api/dataElements'` becomes `apiEndpoint: '/api/24/dataElements'` when `api/24` is being used as base url.
- [feat] `Model.create` was added to force creation of a Model onto the server. This method should be used when generating the ID on the client side. The `Model.create` method can then be used to force a `POST` request.
```js
const optionSet = d2.models.optionSet.create();

optionSet.id = 'A1234567890';
optionSet.name = 'My OptionSet';
optionSet.valueType = 'TEXT';

optionSet.create(); // Will use POST instead of PUT (when no id is specified either .create() or .save() can be used)
```

## 24.0.10
###### _June 21th 2016_

##### Changed
- [fix] Do not send a a `Content-Type` header with the request when no data is available.

## 24.0.9
###### _June 20th 2016_

##### Changed

- [fix] attributeValues is a collection, but within the d2 sense it's just an array. Fix makes sure we copy the attributeValues in the correct way to the api payload. (https://github.com/dhis2/d2/commit/1b05ba30c8762bb13888ee98853f9667c001ebca)

## 24.0.8
###### _June 16th 2016_

##### Changed

- [fix] `compulsoryDataElementOperand` objects do not have a meaningful `id`. When saving these objects we have to supply both the `dataElement` and the `categoryOptionCombo` related to the operand. Fix sets the correct values onto the payload when saving.

## 24.0.7
###### _June 15th 2016_

##### Changed

- [fix] Properties that require special handling (where the members of the collections are not Models) are just copied into the payload. Currently these fields are `greyedFields` and `translations`.

## 24.0.6
###### _June 13th 2016_

##### Changed

- [fix] ModelCollections for the dataSet models were incorrectly initialized due to a bug in the constructor of the DataSetModelDefinition class.

## 24.0.5
###### _June 11th 2016_

##### Changed

- [fix] Minor fix that could result in a `can not read property name of undefined` error to be thrown when saving data.

## 24.0.4
###### _June 11th 2016_

##### Changed

- [feat] `Legend`s can be saved through the `LegendSets` endpoint. This will make working with legends and legendSets a lot easier. As now the legends for a legendSet can be replaced with a single call, without having to add a new legend first and then adding it to the legendSet with a subsequent call.

## 24.0.3
###### _June 9th 2016_

##### Changed

- [feat] Add support for the new `translations` property introduced in the DHIS2 2.24 api.

## 24.0.2
###### _May 20th 2016_

##### Changed

- [fix] Minor fix so that `dataSet.create()` does not throw an error when no data is passed.

## 24.0.1
###### _May 20th 2016_

##### Changed

- [fix] Handle collections where the referenceType does not equal the propertyName correctly when preparing the data for saving. This solves the circular dependency error when running `JSON.stringify` on the `Model` data.
- [feat] Adds default values for the dataElement `Model` aggregationType=NONE valueType=TEXT

