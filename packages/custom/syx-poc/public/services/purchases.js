'use strict';

angular.module('mean.meanStarter').factory('Purchase', [ '$http', '$resource', function($http, $resource) {

    var rootURL = '/api/purchase';

    return $resource('', {
        id: '@id',
        _id: '@_id'
    }, {
        single: {
            url: rootURL + '/single/:id',
            method: 'GET',
            isArray: false
        },
        list: {
            url: rootURL + '/list',
            method: 'POST',
            isArray: false
        }
    });
}]);