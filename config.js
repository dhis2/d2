/* jscs: disable */
/* jshint ignore:start */
System.config({
    baseURL: "/base/src",
    paths: {
        "*": "*.js",
        "d2/*": "*.js",
        "github:*": "../jspm_packages/github/*.js"
    }
});

System.config({
    map: {
        'd2/lib/*': "lib/*",
        'jquery': 'github:components/jquery@2.1.3'
    }
});
/* jshint ignore:end */
/* jscs: enable */