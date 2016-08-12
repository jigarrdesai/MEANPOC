'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', '$state', '$localStorage',
    function($scope, $rootScope, $state, $localStorage) {

        $scope.menus = {};

        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        $scope.isCollapsed = false;

        $scope.logout = function() {
            $localStorage.current = undefined;
			$state.go('auth.login');
        };
    }
]);