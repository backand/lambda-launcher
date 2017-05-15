/**
 * @ngdoc constant
 * @name LambdaLauncher.constant
 *
 * @module LambdaLauncher
 *
 * @description
 * create constant services for global use
 * 
 * @TODO - Keep adding application specific constants here
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .constant('APP_CONFIG', {})
    .constant('_', window._)
    .run([function () {
      window._ = undefined;
    }]);

})();
