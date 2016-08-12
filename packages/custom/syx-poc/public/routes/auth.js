'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider', function($meanStateProvider) {

	// states for users
	$meanStateProvider
		.state('auth', {
			url: '/auth',
			abstract: true,
			templateUrl: 'meanStarter/views/auth/index.html'
		})
		.state('auth.login', {
			url: '/login',
			templateUrl: 'meanStarter/views/auth/login.html',
			controller: 'POCLoginCtrl'
		});
}]);