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
                    if (part.class) {
                        doc.className = part.class;
                        doc.docType = 'class';

                        if (part.extends) {
                            doc.superClass = part.extends;
                        }
                    }

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

            //TODO: Move this out to it's own processor
            _.chain(docs)
            .filter('superClass')
            .forEach(function (doc) {
                    var superClass = _.chain(docs)
                        .filter('className')
                        .find({className: doc.superClass})
                        .value();

                    if (superClass) {
                        var inheritedMethods = _.chain(superClass.methods)
                        .map(function (method) {
                                return _.extend({inherited:true}, method);
                        })
                        .value();

                        doc.methods = doc.methods.concat(inheritedMethods);
                    }
                })
            .value();

            return docs;
        }
    };
};
