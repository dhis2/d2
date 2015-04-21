module.exports = function(extractTypeTransform, wholeTagTransform) {
    return {
        name: 'note',
        docProperty: 'notes',
        multi: true,
        transforms: [ extractTypeTransform, wholeTagTransform ]
    };
};
