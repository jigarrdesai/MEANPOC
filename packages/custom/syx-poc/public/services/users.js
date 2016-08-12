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
        },
        list: {
            url: rootURL + '/list',
            method: 'POST',
            isArray: false
        },
        create: {
            url: rootURL + '/create',
            method: 'POST',
            isArray: false
        },
        update: {
            url: rootURL + '/updateSingle/:id',
            method: 'POST',
            isArray: false
        }
    });
}]);