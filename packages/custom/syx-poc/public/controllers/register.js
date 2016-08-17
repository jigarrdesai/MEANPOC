(function() {
    'use strict';
    angular.module('mean.meanStarter').controller('POCRegisterCtrl', ['$scope', '$state', '$localStorage', 'User', function($scope, $state, $localStorage, User) {
        // Original scaffolded code.

        $scope.forms = {};
        $scope.user = {};
        $scope.input = {
            type: 'password',
            placeholder: 'Password',
            confirmPlaceholder: 'Repeat Password',
            iconClass: '',
            tooltipText: 'Show password'
        };
        $scope.loginSuccess = false;

        $scope.togglePasswordVisible = function() {
            $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
            $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
            $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
            $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
        };

        $scope.register = function() {

            if($scope.forms.login.$valid) {
                User.registerTenant($scope.user, function(data) {

                    $scope.loginSuccess = true;
                    
                }, function(errList) {
                    console.log(errList)
                });
            }
        };
    }]);
})();
