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
  function authInterceptor($q, Backand, $localStorage, $injector,_) {

    return {
      requestError: function (rejection) {
        return $q.reject(rejection);
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        var envConstants = $injector.get('ENV_CONFIG');
        if (rejection.status === 401 && !Backand.isManagingRefreshToken()) {
          var errorMessage =
            Backand.getUsername() ?
              'The session has expired, please sign in again.' :
              null;
          $injector.get('$log').error(errorMessage); 
          $injector.get('$state').go(envConstants.ROUTE_LOGIN_STATE, { err: errorMessage, app: Backand.defaults.appName }, { reload: true });
          $injector.get('Auth').logout();
        }
        return $q.reject(rejection);
      }
    };
  }


})();