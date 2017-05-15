/**
 * @ngdoc service
 * @name LambdaLauncher.service.authInterceptor
 *
 * @module LambdaLauncher
 *
 * @description
 * A interceptor service to intercept valid request
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function() {
  'use strict';
  angular
  .module('LambdaLauncher')
  .factory('authInterceptor', authInterceptor);
  /** @ngInject */
  function authInterceptor($q, $location, Backand) {
    return {
      requestError: function(rejection) {
        return $q.reject(rejection);
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        if ((rejection.config.url + "").indexOf('token') === -1) {
          // When using refresh token, on 401 responses
          // Backand SDK manages refreshing the session and re-sending the requests
          if (rejection.status === 401 && !Backand.isManagingRefreshToken()) {
            var errorMessage =
                Backand.getUsername() ?
                    'The session has expired, please sign in again.' :
                    null;
            $location.path('/login');
          }
        }
        return $q.reject(rejection);
      }
    };
  }


})();