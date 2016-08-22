'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider', function($meanStateProvider) {

	// states for users
	$meanStateProvider
		.state('events', {
			url: '/events',
			params: {
				errorMessage: null
			},
			templateUrl: 'meanStarter/views/events/list.html',
            controller: 'POCEventsCtrl'
		})
		.state('createEvent', {
			url: '/add-event',
			templateUrl: 'meanStarter/views/events/edit.html',
			controller: 'POCEditEventCtrl'
		})
		.state('editEvent', {
			url: '/edit-event/:id',
			params: {
				id: null,
				successMessage: null
			},
			templateUrl: 'meanStarter/views/events/edit.html',
			controller: 'POCEditEventCtrl'
		});
}]);