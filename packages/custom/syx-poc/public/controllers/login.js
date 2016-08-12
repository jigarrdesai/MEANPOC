(function() {
    'use strict';
    angular.module('mean.meanStarter').controller('POCLoginCtrl', ['$scope', '$state', '$localStorage', 'User', function($scope, $state, $localStorage, User) {
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

        $scope.togglePasswordVisible = function() {
            $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
            $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
            $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
            $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
        };

        $scope.login = function() {

            if($scope.forms.login.$valid) {
                User.login($scope.user, function(data) {
                    $localStorage.current = data.user;
                    $localStorage.current.id = data.user._id;

                    $state.go('home');
                    
                }, function(errList) {
                    console.log(errList)
                });
            }
        };
    }]);
})();
