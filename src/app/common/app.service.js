/**
 * @ngdoc service
 * @name LambdaLauncher.service.App
 *
 * @module LambdaLauncher
 *
 * @description
 * App service is used to share data globaly
 * 
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .service('App', AppService);
  /** @ngInject */
  function AppService() {
    var self = this;
    self.pageTitle = '';
  }

})();
