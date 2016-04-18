(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['userService'];
    function HomeController(userService) {
        var vm = this;
        activate();
        ////////////////
        function activate() { }
    }
})();