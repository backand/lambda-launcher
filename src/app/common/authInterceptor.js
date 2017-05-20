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
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .factory('authInterceptor', authInterceptor);
  /** @ngInject */
  function authInterceptor($q, Backand, $localStorage, $injector) {

    return {
      requestError: function (rejection) {
        return $q.reject(rejection);
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        console.warn('authInterceptor is called in responseError');
        var envConstants = $injector.get('ENV_CONFIG');
        if (rejection.status === 401 && !Backand.isManagingRefreshToken()) {
          var errorMessage =
            Backand.getUsername() ?
              'The session has expired, please sign in again.' :
              null;
          $injector.get('$state').go(envConstants.ROUTE_LOGIN_STATE, { error: errorMessage }, { reload: true });
          $injector.get('Auth').logout();
        }
        return $q.reject(rejection);
      }
    };
  }


})();