(function() {
    'use strict';
    angular.module('mean.meanStarter').controller('POCLoginCtrl', ['$scope', 'Global','MeanUser', function($scope, Global, MeanUser) {
        // Original scaffolded code.

        console.log(MeanUser)
        
        $scope.global = Global;
        $scope.package = {
            name: 'meanStarter'
        };
    }]);
})();
