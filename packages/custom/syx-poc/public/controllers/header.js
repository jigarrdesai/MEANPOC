'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Menus', '$state', '$localStorage',
    function($scope, $rootScope, Menus, $state, $localStorage) {

        $scope.menus = {};

        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);
        queryMenu('account', []);


        $scope.isCollapsed = false;
		
        $scope.logout = function() {
            $localStorage.current = undefined;
        };

        $rootScope.$watch('$storage.current', function(newVal) {

			if(newVal) {
				$scope.hdrvars = {
					authenticated: true
				};
				queryMenu('main', defaultMainMenu);
				// $state.go('home');
			} else {
				$scope.hdrvars = {
					authenticated: false
				};
				queryMenu('main', defaultMainMenu);
				// $state.go('home');
			}
        });

    }
]);