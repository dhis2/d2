var _ = require('lodash');

module.exports = function createNavigationDoc(log) {
    return {
        $runAfter: ['groupTags'],
        $runBefore: ['renderDocsProcessor'],
        $process: function (docs) {
            var navigationDocument = {
                outputPath: 'nav.json',
                name: 'Documentation Navigation',
                id: 'navigation',
                docType: 'navigation',
                template: 'navigation.template.json',
                pages: [],
            };

            docs = _.map(docs, function (doc) {
                navigationDocument.pages.push({
                    name: doc.name,
                    pageType: doc.pageType,
                    url: doc.outputPath,
                    module: doc.outputPath.replace('.json', '').split('/')[0] || 'default'
                });

                return doc;
            });


            _.map(navigationDocument.pages, function (doc) {
                console.log(doc.name);
                console.log(doc.pageType);
            });

            navigationDocument.documentation = {
                sections: _.chain(navigationDocument.pages)
                    .filter({pageType: 'documentation'})
                    .filter('module')
                    .groupBy('module')
                    .map(function (links) {
                        return _.sortBy(links, 'name');
                    })
                    .map(function (links) {
                        links.name = links[0].module;
                        return links;
                    })
                    .value()
            };
            navigationDocument.api = {
                sections: _.chain(navigationDocument.pages)
                    .filter({pageType: 'api'})
                    .filter('module')
                    .groupBy('module')
                    .map(function (links) {
                        return _.sortBy(links, 'name');
                    })
                    .map(function (links) {
                        links.name = links[0].module;
                        return links;
                    })
                    .value()
            };

            var routesDocument = {
                id: 'routes',
                name: 'routes',
                outputPath: 'routes.js',
                template: 'routes.template.js',
                sections: navigationDocument.documentation.sections.concat(navigationDocument.api.sections)
            };

            docs.push(navigationDocument);
            docs.push(routesDocument);

            return docs;
        }
    };
};
