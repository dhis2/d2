module.exports = function(toBooleanTransform) {
    return {
        name: 'static',
        docProperty: 'static',
        transforms: [ toBooleanTransform ]
    };
};
