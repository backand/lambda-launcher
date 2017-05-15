/**
 * @ngdoc config
 * @name LambdaLauncher.config
 *
 * @module LambdaLauncher
 *
 * @description
 * Main application configuration block
 * Initialize all providers and setting up configuration
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .config(config);
  /** @ngInject */
  function config($logProvider, BackandProvider, ENV_CONFIG, $httpProvider) {
    // Enable log
    if (ENV_CONFIG.ENV !== 'prod') {
      $logProvider.debugEnabled(true);
    }
    //register authInterceptor to hanlde authentication
    $httpProvider.interceptors.push('authInterceptor');
    //configure backand
    BackandProvider.setAppName(ENV_CONFIG.appName); //your app name
    BackandProvider.setAnonymousToken(ENV_CONFIG.anonymousToken); //Anonymous Token
    BackandProvider.setSignUpToken(ENV_CONFIG.signUpToken); //SignUp Token, its optional for demo app
  }

})();
