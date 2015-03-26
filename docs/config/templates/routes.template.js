'use strict';
angular.module('d2Docs')
    .config(function ($routeProvider) {
        $routeProvider
            /*{% for section in doc.sections  %}*/
            .when('/{$ section.name $}', {
                templateUrl: '{$ section.name $}.html',
                controller: 'sectionController',
                controllerAs: 'section'
            })
            /*{% for page in section  %}*/
            .when('/{$ section.name $}/{$ page.name $}', {
                templateUrl: '{$ page.url $}',
                controller: 'pageController',
                controllerAs: 'page'
            })
            /*{% endfor   %}*/
            /*{% endfor   %}*/
            ;
    });

