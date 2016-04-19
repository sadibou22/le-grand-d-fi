(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http'];
    function ProfileController($http) {
        var vm = this;

        vm.new = {
            name: undefined,
            amount: 0
        };

        activate();

        ////////////////

        function activate() { }
    }
})();