/**
 * @dgRenderFilter fnParams
 * @description Convert a params array to a string of params with types
 */
module.exports = {
    name: 'type',
    process: function (typeExpression) {
        return getTypeHint(typeExpression);
    },
    getTypeHint: getTypeHint
};

function getTypeHint(typeExpression) {
    var typeExpressionClass = 'type-hint-' + typeExpression.replace(/[\W]/gi, '').toLowerCase();

    if (typeExpression) {
        return ['<span class="type-hint ', typeExpressionClass, '">', typeExpression || '*', '</span>'].join('');
    } else {
        return '';
    }
}