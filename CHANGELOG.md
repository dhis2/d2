## [31.9.2](https://github.com/dhis2/d2/compare/v31.9.1...v31.9.2) (2021-03-22)


### Bug Fixes

* remove encoding of query string for analytics requests DHIS2-10722 ([#284](https://github.com/dhis2/d2/issues/284)) ([c810235](https://github.com/dhis2/d2/commit/c81023554f9a0a0b564f08b8afea35fcce5ca043))
* remove unused import ([#285](https://github.com/dhis2/d2/issues/285)) ([6e1a408](https://github.com/dhis2/d2/commit/6e1a408da69cb251142af29895dee312d633b386))

## [31.9.1](https://github.com/dhis2/d2/compare/v31.9.0...v31.9.1) (2021-03-09)


### Bug Fixes

* **current-user:** add getUserGroupIds, allow custom fields in getUserGroups (DHIS2-10625) ([#280](https://github.com/dhis2/d2/issues/280)) ([d3e84a6](https://github.com/dhis2/d2/commit/d3e84a6812b9b1071030568092d568cd51dbe816))

# [31.9.0](https://github.com/dhis2/d2/compare/v31.8.1...v31.9.0) (2020-12-11)


### Bug Fixes

* allow uid for org unit levels ([18a86f8](https://github.com/dhis2/d2/commit/18a86f8bf71cd66e8b881e9df74c2baafd0c3f8e))


### Features

* in-notin-filter-operators ([#148](https://github.com/dhis2/d2/issues/148)) ([026aa1e](https://github.com/dhis2/d2/commit/026aa1e5273baa64267f9a9b3980c517438e66ce))

# D2 Changelog

## 31.6.0
###### _March 7th 2019_

**Breaking changes:**

- Webpack browser bundle has been removed. Current build is a UMD build, see https://github.com/umdjs/umd.

## 31.5.0
###### _February 28th 2019_

**Breaking changes:**

- Changed from babel `es2015` and `stage-2` presets to `babel-preset-env`, so for certain browsers support might have changed. Though currently the support is aligned with our supported browsers.

**Bugfix:**

- Fixed usage of isomorphic-fetch, to allow for usage of d2 in node and the browser.

## 30.1.0
###### _February 15th 2019_

**Breaking changes:**

- `d2.Api` Api methods will reject with an error when passing urls with an encoded query-string, or when passing urls with a malformed query string. The existing query string and anything that will be appended will be encoded for you by d2.Api's methods.

## 28.3.0
###### _October 26th 2017_

**Breaking changes:**

- `d2.dataStore` API has changed in order to be more streamlined and easier to use:
    - `d2.dataStore.create()` has been added to be able to ensure a new (empty) namespace.
    - `d2.dataStore.get()` now rejects if the namespace does not exist.
    - `d2.dataStore.getKeys()` now always fetches from the server, use `d2.dataStore.keys`-member to get a list of 
    internal-keys in a synchronous way.
    
##### Added

- `d2.currentUser.dataStore` has been added, and is a wrapper around UserDataStore. The API shares most functionality with `d2.dataStore`.

## 28.0.0
###### _September 19th 2017_

**Breaking changes:**

- `d2.system.loadAppStore` has changed in order to support the new [central app store](https://play.dhis2.org/appstore).
- Support for `dataType` and `contentType` options on API requests have been removed. These were added for
  compatibility with jQuery, and have been deprecated since version 2.25. To migrate, manipulate the request headers
  directly instead:
  - `dataType` corresponds to the `Accept` header:
    - Before: `api.get(url, { dataType: 'text' })`
    - Now: `api.get(url, { headers: { 'Accept': 'text/plain' }})`
  - `contentType` corresponds to the `Content-Type` header:
    - Before: `api.post(url, data, { contentType: 'text' })`
    - Now: `api.post(url, data, { headers: { 'Content-Type': 'text/plain' }})`

## 27.0.0
###### _February 20th 2016_

**Breaking changes:**

- `d2.currentUser.uiLocale` has been removed, `d2.currentUser.userSettings.get` should be used instead.
- `userSettings.get` will now now always return a Promise (This therefore also applies to `d2.currentUser.userSettings.get`)
- `systemSettings.get` will now always return a Promise.

## 25.2.0
###### _November 18th 2016_

**Breaking change:**

- Calling `save()` on an instance of `d2.Model` or `d2.ModelCollectionProperty`
that has no changes will now return a promise that immediately resolves to an
empty object, in stead of a promise that's rejected with an error message

## 25.0.1
###### _August 1st 2016_

##### Added

- [feat] `clone()` can now be used on a model instance to clone an object
