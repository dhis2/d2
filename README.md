# d2

[![Build Status](https://travis-ci.org/dhis2/d2.svg?branch=v25)](https://travis-ci.org/dhis2/d2)
[![Test Coverage](https://codeclimate.com/github/dhis2/d2/badges/coverage.svg)](https://codeclimate.com/github/dhis2/d2/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/d2/badges/gpa.svg)](https://codeclimate.com/github/dhis2/d2)
[![npm version](https://badge.fury.io/js/d2.svg)](https://badge.fury.io/js/d2)

==== 

## Documentation
The documentation is temporarily available on [http://d2.markionium.com](http://d2.markionium.com)

## Quickstart  guide

### Install

Start with adding d2 to your project.

`yarn add d2` or `npm install d2`

After installing you will be able to import the library into your project by using the files in the `lib` folder.

```js
// Using ES2015 imports
import d2 from 'd2/lib/d2';

// Using CommonJS imports
var d2 = require('d2/lib/d2');
```

If you want to use `d2` as just a global variable on the window object you can include one of the following scripts in
your page `d2/lib/d2-browser.js` or `d2/lib/d2-browser.min.js`


### Initialise the library
To be able to use d2 you will first need to initialise the library. This is required to let the library know
where it should load data from (e.g. the schemas, currentUser, authorities). The schemas are the definitions of the data model as it is used in DHIS2.

To do this you have can provide d2 with a `baseUrl`. (If you don't provide any the default of `../api` will be used)

```js
import {init} from 'd2/lib/d2';

init({baseUrl: 'http://apps.dhis2.org/dev/api'})
  .then(d2 => {
    //Your d2 is initialised and ready to use.
  });
```

## Get first page of users and print their name
```js
d2.models.user.list()
  .then(userCollection => {
    userCollection.forEach(user => console.log(user.name)));
  });
```

# Core Concepts

## D2

The d2 library is a javascript library that abstacts away the dhis2 api and lets you use javascript models to communicate with your dhis2 server.

The models are dynamically build using the /api/schemas resource that is available through the dhis2 web api.

## Models

### Basic concepts

#### Model

Is an an instance of a model

#### ModelDefinition

Is a descriptive object that describes the model and is used to create Models

The Model definition contains information like
    - What is the endpoint for the model
    - What are the properties that the model has

# How do i? (FAQ)

## Figure out which models i can use?

The types of models to use include almost all the available endpoint points in DHIS2. The ones available are the _generic_ endpoints.
A more practical way to get the list is to use either the schemas endpoint, or use `d2` itself.

A request to the following url will get you all the names of schemas available. `http://play.dhis2.org/demo/api/schemas.json?fields=name`

If you already have `d2` available you can do the following.

```js
import {getInstance} from 'd2/lib/d2';

getInstance(d2 => {
    console.log(Object.keys(d2.models));
});
```
