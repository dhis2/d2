var _ = require('lodash');

module.exports = function mergeDocs() {
    return {
        $runAfter: ['docsBuilder'],
        $runBefore: ['groupTags'],
        $process: function (docs) {
            var nonJsDocs = _.reject(docs, function (doc) {
                return doc.fileInfo.extension === 'js';
            });

            docs = _.chain(docs)
                .filter(function (doc) {
                    return doc.fileInfo.extension === 'js';
                })
                .map(function (doc) {
                    doc.name = doc.fileInfo.baseName;
                    delete doc.fileInfo.content;
                    return doc;
                })
                .groupBy('name')
                .map(function (subDocs) {
                    var firstDoc = _.first(subDocs);

                    var docs = {
                        id: firstDoc.name,
                        pageType: 'api',
                        name: firstDoc.name,
                        moduleName: getModuleName(firstDoc),
                        fileInfo: firstDoc.fileInfo,
                        outputPath: [getModuleName(firstDoc), 'json'].join('.'),
                        subDocs: _.map(subDocs, function (doc) { return _.omit(doc, [
                            'fileInfo',
                            'content',
                            'startingLine',
                            'endingLine',
                            'docType',
                            'path',
                            'outputPath',
                            'codeAncestors',
                            'codeNode'
                            ]);
                        })
                    };

                    return docs;
                })
                .value();

            return nonJsDocs.concat(docs);
        }
    };

    function getModuleName(doc) {
        return doc.fileInfo.relativePath.replace('.js', '');
    }
};
