(function () {
    'use strict';
    var app = angular.module('app', [
        'ngRoute'
    ]);
    app.constant('routes', getRoutes());
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    title: 'home',
                    templateUrl: '/js/ng/views/home.html',
                    settings: {}
                }
            }
        ];
    }    
    app.config(['$httpProvider', '$provide', '$routeProvider', appConfigurator]);
    function appConfigurator($httpProvider, $provide, $routeProvider) {
        $provide.factory('$routeProvider', function() {
            return $routeProvider;
        });
        $provide.decorator('$exceptionHandler', function($delegate, $injector) {
            return function(exception, cause) {
                $delegate(exception, cause);
            };
        });
    }
    app.run(['$http', '$location', '$rootScope', '$injector', '$route', '$routeProvider', 'routes', run]);
    function run($http, $location, $rootScope, $injector, $route, $routeProvider, routes) {
        routes.forEach(function(r) {
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
        $route.reload();

        function setRoute(url, config) {
            config.resolve = angular.extend(config.resolve || {}, {
            });
            $routeProvider.when(url, config);
            if (config.editUrl) {
                $routeProvider.when(config.editUrl, config);
            }
        }
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
        });
    }
})();