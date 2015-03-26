/**
 * @dgRenderFilter json
 * @description Convert the object to a JSON string
 */
module.exports = {
    name: 'fnParams',
    process: function(obj) {
        if (!obj) {
            return '';
        }

        return obj.map(function (param) {
            return [param.name, param.typeExpression || '*'].join(':');
        }).join(', ');
    }
};