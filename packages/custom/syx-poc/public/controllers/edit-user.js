(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('POCEditUserCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'User', function($scope, $rootScope, $state, $stateParams, $localStorage, User) {
		
		$scope.type = 'User';
		$scope.user = {};
		$scope.user.type = 'user';
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

		if($state.is('editUser')) {
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

				var operation = $state.is('editUser') ? 'update' : 'create';
				
				var request = angular.copy($scope.user);
				request.current = angular.copy($localStorage.current);

				User[operation](request, function(data) {

					$scope.successMessage = 'User Saved';
					if(operation == 'update') {
						$state.transitionTo('editUser', {id: data.id});
					} else {
						$state.transitionTo('users');
					}
				}, function(errList, a, b) {

					$scope.errorMessage = errList.data.msg || errList.data[0].msg;
				});
			}
		};
  	}]);
})();
