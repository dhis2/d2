# D2 Changelog

## 24.0.2
###### _May 20th 2016_

##### Changed

- [fix] Minor fix so that `dataSet.create()` does not throw an error when no data is passed.

## 24.0.1
###### _May 20th 2016_

##### Changed

- [fix] Handle collections where the referenceType does not equal the propertyName correctly when preparing the data for saving. This solves the circular dependency error when running `JSON.stringify` on the `Model` data.
- [feat] Adds default values for the dataElement `Model` aggregationType=NONE valueType=TEXT

