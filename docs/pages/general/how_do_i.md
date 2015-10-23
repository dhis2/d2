# How do i?

# Figure out which models i can use?

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