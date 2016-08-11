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
			resolve: {
				loggedin: function(MeanUser) {
					return MeanUser.checkLoggedOut();
				}
			},
			controller: 'POCLoginCtrl'
		})
		.state('forgot-password', {
			url: '/forgot-password',
			templateUrl: 'meanStarter/views/auth/forgot-password.html',
			resolve: {
				loggedin: function(MeanUser) {
					return MeanUser.checkLoggedOut();
				}
			}
		})
		.state('reset-password', {
			url: '/reset/:tokenId',
			templateUrl: 'meanStarter/views/users/reset-password.html',
			resolve: {
				loggedin: function(MeanUser) {
					return MeanUser.checkLoggedOut();
				}
			}
		});
}]);