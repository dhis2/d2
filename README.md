# d2

[![build status](https://travis-ci.com/dhis2/d2.svg?branch=master)](https://travis-ci.com/dhis2/d2)
[![greenkeeper badge](https://badges.greenkeeper.io/dhis2/d2.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/d2.svg)](https://badge.fury.io/js/d2)

The full api documentation is available [here](https://d2-ci.github.io/d2/). To get started we suggest you read the [overview](https://d2-ci.github.io/d2/tutorial-overview.html). If you already know what you're looking for we suggest the reference material on what is available on the instance of [d2](https://d2-ci.github.io/d2/module-d2.init-d2.html).

For more information on how the models work the [model module documentation](https://d2-ci.github.io/d2/module-model.html) is helpful reference material. For other questions see the [FAQ](https://d2-ci.github.io/d2/tutorial-FAQ.html).

## Quickstart guide

### Install

Start with adding d2 to your project:

`yarn add d2` or `npm install d2`

After installing you will be able to import the library into your project by using the files in the `lib` folder:

```js
// Using ES2015 imports
import d2 from 'd2'

// Using CommonJS imports
var d2 = require('d2')
```

### Initialise the library

To be able to use d2 you will first need to initialise the library. This is required to let the library know where it should load its data from (e.g. the schemas, currentUser, authorities). The schemas are the definitions of the data model as used in DHIS2.

To do this you can provide d2 with a `baseUrl` (if you don't provide any the default of `../api` will be used):

```js
import { init } from 'd2'

init({ baseUrl: 'http://apps.dhis2.org/dev/api' }).then((d2) => {
    //Your d2 is initialised and ready to use.
})
```

### Get first page of users and print their names

```js
d2.models.user.list()
  .then(userCollection => {
    userCollection.forEach(user => console.log(user.name)));
  });
```

That's it! See the documentation referenced above for further information.

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [LIBS](https://jira.dhis2.org/projects/LIBS) project.

Deep links:

-   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10006&components=11011)
-   [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10300&components=11011)
-   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10003&components=11011)
