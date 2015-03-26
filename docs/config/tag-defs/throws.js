module.exports = function(extractTypeTransform, wholeTagTransform) {
    return {
        name: 'throws',
        multi: true,
        //docProperty: 'throws',
        transforms: [ extractTypeTransform, wholeTagTransform ]
    };
};
