var _ = require('lodash');

module.exports = function mdFileFileReader(log) {
    var reader = {
        name: 'mdFileFileReader',
        defaultPattern: /\.md$/,
        getDocs: function(fileInfo) {
            return [{
                docType: 'md',
                content: fileInfo.content
            }];
        }
    };

    return reader;
};
