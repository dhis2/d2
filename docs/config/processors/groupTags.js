var _ = require('lodash');

module.exports = function groupTags(log) {
    return {
        $runAfter: ['mergeDocs'],
        $runBefore: ['renderDocsProcessor'],
        $process: function (docs) {
            docs = _.map(docs, function (doc) {
                doc.methods = [];
                doc.properties = [];
                doc.functions = [];

                doc.subDocs.forEach(function (part) {
                    if (part.constructor === '') {
                        doc.constructorFunction = part;
                    }

                    if (part.method) {
                        part.name = part.method;
                        doc.methods.push(part);
                    }

                    if (part.properties) {
                        doc.properties = doc.properties.concat(part.properties.map(function (property) {
                            property.extraInfo = part.description;

                            return property;
                        }));
                    }

                    if (part.function) {
                        part.name = part.function;
                        doc.functions.push(part);
                    }
                });
                //
                //console.log();
                //console.log('========================================================================================');
                //console.log(doc.name);
                //console.log('==Constructor===========================================================================');
                ////console.log(doc);
                //console.log('==Properties============================================================================');
                //doc.properties.forEach(function (method) {
                //    console.log(method);
                //});
                //console.log('==Methods===============================================================================');
                //doc.methods.forEach(function (method) {
                //    console.log(method);
                //});

                return doc;
            });

            return docs;
        }
    };
};
