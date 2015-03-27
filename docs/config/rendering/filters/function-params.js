var getTypeHint = require('./var-type').getTypeHint;

/**
 * @dgRenderFilter fnParams
 * @description Convert a params array to a string of params with types
 */
module.exports = {
    name: 'fnParams',
    process: function(obj) {
        if (!obj) {
            return '';
        }

        return obj.map(function (param) {
            return ['<span class="doc-function-parameter-wrap">', param.name, ' ', getTypeHint(param.typeExpression), '</span>'].join('');
        }).join(', ');
    }
};