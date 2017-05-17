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
(function () {
  'use strict';

  angular
    .module('LambdaLauncher')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        component: 'signin'
      })
      .state('login', {
        url: '/login',
        component: 'signin'
      })
      .state('dashboard', {
        absolute: true,
        url: '/dash',
        template: '<ui-view></ui-view>'
      })
      .state('dashboard.apps', {
        url: '/apps',
        component: 'apps'
      })
      .state('dashboard.app', {
        url: '/app/:app_id',
        component: 'app'
      })
      .state('dashboard.parmas', {
        url: 'app/:app_id/params/:param_id',
        component: 'appParams'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
