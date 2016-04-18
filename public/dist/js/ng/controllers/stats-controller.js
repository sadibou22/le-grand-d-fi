(function () {
    'use strict';

    angular
        .module('app')
        .controller('StatsController', StatsController);

    StatsController.$inject = ['$http'];
    function StatsController($http) {
        var vm = this;
        vm.io = undefined;
        activate();
        ////////////////
        function activate() { 
            vm.io = io();
        }
    }
})();