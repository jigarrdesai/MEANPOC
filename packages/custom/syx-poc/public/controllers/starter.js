(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('StarterController', ['$scope', '$rootScope', 'Global', '$localStorage', function($scope, $rootScope, Global, $localStorage) {
		
		console.log($rootScope);
		// Original scaffolded code.
		
		$scope.global = Global;
		$rootScope.$storage = $localStorage;
  	}]);
})();
