'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider', function($meanStateProvider) {

	// states for users
	$meanStateProvider
		.state('purchases', {
			url: '/purchases',
			templateUrl: 'meanStarter/views/purchases/list.html',
            controller: 'POCPurchasesCtrl'
		})
        ;
}]);