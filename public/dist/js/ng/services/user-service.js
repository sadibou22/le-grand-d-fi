(function () {
    'use strict';

    angular
        .module('app')
        .service('UserService', UserService);

    UserService.$inject = [];
    function UserService() {
        this.exposedFn = exposedFn;
        ////////////////
        function exposedFn() { }
    }
})();