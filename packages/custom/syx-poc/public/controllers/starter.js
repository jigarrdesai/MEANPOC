(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('StarterController', ['$scope', '$rootScope', '$localStorage', function($scope, $rootScope, $localStorage) {
		
		console.log($rootScope);
		$rootScope.$storage = $localStorage;
  	}]);
})();
