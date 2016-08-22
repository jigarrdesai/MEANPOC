'use strict';

angular.module('mean.meanStarter').factory('Event', [ '$http', '$resource', function($http, $resource) {

    var rootURL = '/api/event';
    var pgURL = '/api/pg/event';

    return $resource('', {
        id: '@id',
        _id: '@_id'
    }, {
        single: {
            url: pgURL + '/single/:id',
            method: 'GET',
            isArray: false
        },
        list: {
            url: pgURL + '/list',
            method: 'POST',
            isArray: false
        },
        create: {
            url: pgURL + '/create',
            method: 'POST',
            isArray: false
        },
        update: {
            url: pgURL + '/updateSingle/:_id',
            method: 'POST',
            isArray: false
        }
    });
}]);