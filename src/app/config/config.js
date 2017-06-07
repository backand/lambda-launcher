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
    var appName, anonymousToken, queryParams = getUrlParams(window.location.href) || {};
    // Enable log
    var isDebug = ENV_CONFIG.ENV !== 'prod' ? true : false;
      $logProvider.debugEnabled(isDebug);

    appName = queryParams.appName;
    anonymousToken = queryParams.anonymousToken;
    if (anonymousToken) {
      try {
        anonymousToken = $base64.decode(anonymousToken);
      } catch (error) {
        console.error('Unable to decode token');
      }
    }


    //register authInterceptor to hanlde authentication
    $httpProvider.interceptors.push('authInterceptor');
    //configure backand
    BackandProvider.manageRefreshToken = true;
    if (appName && anonymousToken) {
      //go to functions page   
      BackandProvider.setAppName(appName);
      BackandProvider.setAnonymousToken(anonymousToken);
    } else if (!appName && !anonymousToken) {
      BackandProvider.setAppName(ENV_CONFIG.appName);
    } else if (appName && !anonymousToken) {
      BackandProvider.setAppName(appName);
      BackandProvider.setAnonymousToken(ENV_CONFIG.anonymousToken);
    }else if (!appName && anonymousToken) {
      BackandProvider.setAppName(ENV_CONFIG.appName);
      BackandProvider.setAnonymousToken(anonymousToken);
    }

  }
  function getUrlParams(url) {
    var queryString = url.split("?")[1] || '';
    var keyValuePairs = queryString.split("&");
    var keyValue, params = {};
    keyValuePairs.forEach(function (pair) {
      keyValue = pair.split("=");
      params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
    });
    return params;
  }

})();
