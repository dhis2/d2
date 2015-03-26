var _ = require('lodash');

module.exports = function createNavigationDoc(log) {
    return {
        $runAfter: ['groupTags'],
        $runBefore: ['renderDocsProcessor'],
        $process: function (docs) {
            var navigationDocument = {
                outputPath: 'nav.html',
                name: 'Documentation Navigation',
                id: 'navigation',
                docType: 'template',
                template: 'navigation.template.html',
                pages: []
            };

            docs = _.map(docs, function (doc) {
                navigationDocument.pages.push({
                    name: doc.name,
                    url: doc.outputPath,
                    module: doc.outputPath.replace('.html', '').split('/')[0] || 'default'
                });

                return doc;
            });

            navigationDocument.sections = _.chain(navigationDocument.pages)
                .filter('module')
                .groupBy('module')
                .map(function (links) {
                    return _.sortBy(links, 'name');
                })
                .map(function (links) {
                    links.name = links[0].module;
                    return links;
                })
                .value();

            var routesDocument = {
                id: 'routes',
                name: 'routes',
                outputPath: 'routes.js',
                template: 'routes.template.js',
                sections: navigationDocument.sections
            };

            docs.push(navigationDocument);
            docs.push(routesDocument);

            return docs;
        }
    };
};
