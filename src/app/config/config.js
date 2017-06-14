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
  function config($logProvider, BackandProvider, ENV_CONFIG, $httpProvider, $localStorageProvider) {
    var appName, anonymousToken, queryParams = getUrlParams(window.location.href) || {}, urlSegments = getUrlSeg(window.location.href);
    // Enable log
    var isDebug = ENV_CONFIG.ENV !== 'prod' ? true : false;
    $logProvider.debugEnabled(isDebug);

    //#/appName  
    appName = urlSegments[0];

    anonymousToken = queryParams.t;
    if (anonymousToken) {
      try {
        anonymousToken = $base64.decode(anonymousToken);
      } catch (error) {
        console.error('Unable to decode token');
      }
    }

    //register authInterceptor to handle authentication
    $httpProvider.interceptors.push('authInterceptor');
    $localStorageProvider.setKeyPrefix(appName + '_');
    //configure backand
    var config = { appName: appName };

    if (anonymousToken) {
      config.anonymousToken = anonymousToken;
    } else {
      config.useAnonymousTokenByDefault = false;
    }

    BackandProvider.init(config);


    // if (appName && anonymousToken) {
    //   //go to functions page
    //   BackandProvider.setAppName(appName);
    //   BackandProvider.setAnonymousToken(anonymousToken);
    // }
    // else if (!appName && !anonymousToken) {
    //   BackandProvider.setAppName(ENV_CONFIG.appName);
    // } else if (appName && !anonymousToken) {
    //   BackandProvider.setAppName(appName);
    //   BackandProvider.setAnonymousToken(ENV_CONFIG.anonymousToken);
    // }else if (!appName && anonymousToken) {
    //   BackandProvider.setAppName(ENV_CONFIG.appName);
    //   BackandProvider.setAnonymousToken(anonymousToken);
    // }

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

  function getUrlSeg(url) {
    //assume the app name is just after the #/
    if (url.indexOf('#') === -1) {
      console.error('URL does not carry appName');
      return [];
    }
    var segs = url.split('#')[1];
    segs = _.trim(segs, '/');
    segs = segs.split('/');
    return segs;
  }

})();
