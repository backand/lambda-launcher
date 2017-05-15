/**
 * @ngdoc constant
 * @name LambdaLauncher.config
 *
 * @module LambdaLauncher
 *
 * @description
 * setup application routes
 * @todo move component specific routes to component directory
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function() {
  'use strict';

  angular
    .module('LambdaLauncher')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        component:'home'
      })
      .state('login', {
        url: '/login',
        component:'home'
      })
      .state('dashboard', {
        url: '/dashboard',
        component:'dashboard'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
