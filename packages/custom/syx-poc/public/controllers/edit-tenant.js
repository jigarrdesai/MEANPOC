(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('POCEditTenantCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'User', function($scope, $rootScope, $state, $stateParams, $localStorage, User) {
		
		$scope.type = 'Tenant';
		$scope.user = {};
		$scope.user.type = 'tenant';
		$scope.user.admin = null;
		$scope.user.tenant = null;

		$scope.forms = {};
		$scope.successMessage = null;
		$scope.errorMessage = null;

		if($state.is('editTenant')) {
			$scope.editMode = true;
			if($stateParams.id) {
				User.single({
					id: $stateParams.id
				}, function(data) {
					$scope.user = data.user;
				}, function(errList) {
					$state.go('users');
				});
			} else {
				$state.go('users');
			}
		}

		$scope.saveUser = function() {

			$scope.successMessage = null;
			$scope.errorMessage = null;

			if($scope.forms.saveUser.$valid) {

				var operation = ($state.is('editTenant') ? 'update' : 'create');
				
				var request = angular.copy($scope.user);
				request.current = angular.copy($localStorage.current);

				User[operation](request, function(data) {

					$scope.successMessage = 'Tenant Saved';
					$state.transitionTo('editTenant', {id: data.id});
				}, function(errList) {

					$scope.errorMessage = errList.data.msg || errList.data[0].msg;
				});
			}
		};
  	}]);
})();
