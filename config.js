System.config({
  "baseURL": "/base/src",
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "d2/*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "d2/lib/*": "lib/*",
    "jquery": "github:components/jquery@2.1.3"
  }
});

