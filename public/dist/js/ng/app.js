(function () {
    'use strict';
    var app = angular.module('app', [
        'ui.router'
    ]);
    app.config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise('/');
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'stats': { templateUrl: '/js/ng/views/stats.html', },
                    'profile': { templateUrl: '/js/ng/views/profile.html' }
                }
            });
    });
    app.run(['$http', '$location', '$rootScope', '$injector', run]);
    function run($http, $location, $rootScope, $injector) {
    }
})();