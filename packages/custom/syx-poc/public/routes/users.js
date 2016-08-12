'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider', function($meanStateProvider) {

	// states for users
	$meanStateProvider
		.state('users', {
			url: '/users',
			templateUrl: 'meanStarter/views/users/list.html',
            controller: 'POCUsersCtrl'
		})
		.state('createUser', {
			url: '/add-user',
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditUserCtrl'
		});
}]);