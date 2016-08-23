(function() {
  	'use strict';

  	angular.module('mean.meanStarter').controller('POCEditEventCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'Event', function($scope, $rootScope, $state, $stateParams, $localStorage, Event) {
		
		$scope.type = 'Event';
		$scope.event = {};
		$scope.event.admin = null;
		$scope.event.tenant = null;

		$scope.forms = {};
		$scope.successMessage = null;
		$scope.errorMessage = null;

		if($state.is('editEvent')) {
			$scope.editMode = true;
			
			if($stateParams.successMessage) {
				$scope.successMessage = angular.copy($stateParams.successMessage);
			}

			if($stateParams.id) {
				Event.single({
					id: $stateParams.id
				}, function(data) {
					$scope.event = data.event;
				}, function(errList) {
					$state.go('events');
				});
			} else {
				$state.go('events');
			}
		}

		$scope.saveEvent = function() {

			$scope.successMessage = null;
			$scope.errorMessage = null;

			if($scope.forms.saveEvent.$valid) {

				var operation = $state.is('editEvent') ? 'update' : 'create';
				
				var request = angular.copy($scope.event);
				request.current = angular.copy($localStorage.current);

				Event[operation](request, function(data) {

					$scope.successMessage = 'Event Saved';
					$state.transitionTo('editEvent', {id: data.id, successMessage: 'Event successfully created.'});
				}, function(errList, a, b) {

					$scope.errorMessage = errList.data.msg || errList.data[0].msg;
				});
			}
		};

		$scope.$watch('event.start', function(newVal) {
			if(newVal && typeof newVal == 'string') {
				$scope.event.start = new Date(newVal);
			}
		});

		$scope.$watch('event.end', function(newVal) {
			if(newVal && typeof newVal == 'string') {
				$scope.event.end = new Date(newVal);
			}
		});
  	}]);
})();
