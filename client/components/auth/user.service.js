'use strict';

angular.module('beerIgoApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
