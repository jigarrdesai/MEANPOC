(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('POCEditAdminCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'User', function($scope, $rootScope, $state, $stateParams, $localStorage, User) {
		
		$scope.type = 'Admin';
		$scope.tenants = [];
		$scope.user = {};
		$scope.user.type = 'admin';
		$scope.user.admin = null;
		$scope.user.tenant = null;

		$scope.types = [
			{
				value: 'user',
				label: 'User'
			},
			{
				value: 'admin',
				label: 'Admin'
			}
		];
		$scope.forms = {};
		$scope.successMessage = null;
		$scope.errorMessage = null;

		if($state.is('editAdmin')) {
			$scope.editMode = true;
			if($stateParams.id) {
				User.single({
					id: $stateParams.id
				}, function(data) {
					$scope.user = data.user;
				}, function(errList) {
					$state.go('admins');
				});
			} else {
				$state.go('admins');
			}
		} else {
			User.listTenant({
				current: $localStorage.current,
				skip: 0,
				limit: 100
			}, function(data) {
				if(data.count > 0) {
					$scope.tenants = data.list;
				} else {
					$scope.errorMessage = 'Can not create Admin User, Please Create Tenant first.';
				}
			}, function() {
				$scope.errorMessage = 'Can not create Admin User, Please reload the page.';
			})
		}

		$scope.saveUser = function() {

			$scope.successMessage = null;
			$scope.errorMessage = null;

			if($scope.forms.saveUser.$valid) {

				var operation = ($state.is('editAdmin') ? 'update' : 'create');
				
				var request = angular.copy($scope.user);
				request.current = angular.copy($localStorage.current);

				User[operation](request, function(data) {

					$scope.successMessage = 'Admin Saved';
					$state.transitionTo('editAdmin', {id: data.id});
				}, function(errList) {

					$scope.errorMessage = errList.data.msg || errList.data[0].msg;
				});
			}
		};
  	}]);
})();
