'use strict';

angular.module('mean.meanStarter').factory('User', [ '$http', '$resource', function($http, $resource) {

    var rootURL = '/api/user';

    return $resource('', {
        id: '@id'
    }, {
        login: {
            url: rootURL + '/login',
            method: 'POST',
            isArray: false
        }
    });
}]);