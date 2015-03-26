var _ = require('lodash');

module.exports = function docsBuilder(log) {
    return {
        $runAfter: ['tags-parsed'],
        $runBefore: ['renderDocsProcessor'],
        $process: function (docs) {
            docs = _.map(docs, function (doc) {
                return doc;
            });

            return docs;
        }
    };
};
