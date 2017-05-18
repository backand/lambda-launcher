/**
 * @ngdoc module
 * @name LambdaLauncher
 *
 * @module LambdaLauncher
 *
 * @description
 * Create main module (Application) with core dependencies
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher', [
      'ngResource',
      'ngAnimate',
      /**
       * @module backand
       *
       * @description
       * The backand module provides Backand SDK APIs
       */
      'backand',
      /**
       * @module ui.router
       *
       * @description
       * AngularUI Router is a routing framework, which implements flexible routing with nested views in AngularJS.
       */
      'ui.router',
      /**
       * @module ui.router.components
       *
       * @description
       * polyfil to support routes in angular new componenets
       */
      'ui.router.components',

      /**
      * @module LambdaLauncher.envConfig
      *
      * @description
      * A module which is created dynamically during build/serve process. This module has a constant service ENV_CONFIG which serves configurations from .env file.
      * .env file is a ENV specific file
      */
      'LambdaLauncher.envConfig',
      'toaster',
      'ui.bootstrap',
      'ngStorage'
    ]);

})();
