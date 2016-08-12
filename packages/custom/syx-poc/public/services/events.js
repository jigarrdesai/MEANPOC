'use strict';

angular.module('mean.meanStarter').factory('Event', [ '$http', '$resource', function($http, $resource) {

    var rootURL = '/api/event';

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
        },
        create: {
            url: rootURL + '/create',
            method: 'POST',
            isArray: false
        },
        update: {
            url: rootURL + '/updateSingle/:_id',
            method: 'POST',
            isArray: false
        }
    });
}]);