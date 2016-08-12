'use strict';

angular.module('mean.meanStarter').factory('User', [ '$http', '$resource', function($http, $resource) {

    var rootURL = '/api/user';

    return $resource('', {
        id: '@id',
        _id: '@_id'
    }, {
        login: {
            url: rootURL + '/login',
            method: 'POST',
            isArray: false
        },
        single: {
            url: rootURL + '/single/:id',
            method: 'GET',
            isArray: false
        },
        singleAdmin: {
            url: rootURL + '/singleAdmin/:id',
            method: 'GET',
            isArray: false
        },
        singleTenant: {
            url: rootURL + '/singleTenant/:id',
            method: 'GET',
            isArray: false
        },
        list: {
            url: rootURL + '/list',
            method: 'POST',
            isArray: false
        },
        listAdmin: {
            url: rootURL + '/listAdmin',
            method: 'POST',
            isArray: false
        },
        listTenant: {
            url: rootURL + '/listTenant',
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