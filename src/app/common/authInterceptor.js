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
      /*request : function(config){
        if(_.endsWith(config.url,'config')){
          config.headers.Authorization = 'Bearer ' + '03b73277-bb28-40bd-a82b-11c4ea21cfa8';
        }
        return config;
      },*/
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
          $injector.get('$state').go(envConstants.ROUTE_LOGIN_STATE, { error: errorMessage, app: Backand.defaults.appName }, { reload: true });
          $injector.get('Auth').logout();
        }
        return $q.reject(rejection);
      }
    };
  }


})();