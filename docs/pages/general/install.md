# How to install d2 for your project...

Install d2 dependency. This dependency will be removed in a future version as we are moving towards adopting the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) api.
```sh
npm install jquery
```

Install d2 from npm
```sh
npm install d2
```

After installing you will be able to import the library into your project by using the files in the `lib` folder.

```js
// Using ES2015 imports
import d2 from 'd2/lib/d2';

// Using CommonJS imports
var d2 = require('d2/lib/d2');
```

If you want to use `d2` as just a global variable on the window object you can include one of the following scripts in
your page `d2/lib/d2-browser.js` or `d2/lib/d2-browser.min.js`
