#Examples

## Initialise the library
To be able to use d2 you will first need to initalise the library. This is required to let the library know
where it should load the schemas from. The schemas are the definitions of the datamodel as it is used in DHIS2. To do this
you have can provide d2 with a `baseUrl`.

```js
import d2Init from 'd2';

d2Init({baseUrl: 'http://apps.dhis2.org/dev/api'})
  .then(d2 => {
    //Your d2 is initialised and ready to use.
  });
```

##Get first page of users and print their name
```js
d2.models.user.list()
  .then(userCollection => userCollection.forEach(user => console.log(user.name)));
```
