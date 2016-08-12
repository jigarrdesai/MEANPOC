'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$state', '$localStorage', function($scope, $state, $localStorage) {

    if(!$localStorage.current) {
        $state.go('auth.login');
    }
}]);