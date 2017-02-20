# D2 Changelog

## 27.0.0-0
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
