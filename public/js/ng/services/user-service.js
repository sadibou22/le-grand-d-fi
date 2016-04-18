(function () {
    'use strict';

    angular
        .module('app')
        .service('userService', userService);

    userService.$inject = [];
    function userService() {
        var service = {};
        service.exposedFn = exposedFn;
        return service;
        ////////////////

        function exposedFn() { }
    }
})();