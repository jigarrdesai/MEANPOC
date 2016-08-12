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
		.state('admins', {
			url: '/admins',
			templateUrl: 'meanStarter/views/users/list.html',
            controller: 'POCAdminsCtrl'
		})
		.state('tenants', {
			url: '/tenants',
			templateUrl: 'meanStarter/views/users/list.html',
            controller: 'POCTenantsCtrl'
		})
		.state('createUser', {
			url: '/add-user',
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditUserCtrl'
		})
		.state('createAdmin', {
			url: '/add-admin',
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditAdminCtrl'
		})
		.state('createTenant', {
			url: '/add-tenant',
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditTenantCtrl'
		})
		.state('editUser', {
			url: '/edit-user/:id',
			param: {
				id: null
			},
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditUserCtrl'
		})
		.state('editAdmin', {
			url: '/edit-admin/:id',
			param: {
				id: null
			},
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditAdminCtrl'
		})
		.state('editTenant', {
			url: '/edit-tenant/:id',
			param: {
				id: null
			},
			templateUrl: 'meanStarter/views/users/edit.html',
			controller: 'POCEditTenantCtrl'
		});
}]);