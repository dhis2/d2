/**
 * Return true since the tag is present
 */
module.exports = function toBooleanTransform() {
    return function(/*doc, tag, value*/) {
        return true;
    };
};
