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
      .state('login', {
        url: '/login?error',
        component: 'signin',
        data: {
          title: 'Login'
        }
      })
      .state('dashboard', {
        absolute: true,
        url: '/dash',
        data: {
          requiresLogin: true
        },
        template: '<ui-view></ui-view>'
      })
      .state('dashboard.apps', {
        url: '/apps',
        data: {
          requiresLogin: true,
          title: 'My Applications'
        },
        component: 'apps'
      })
      .state('dashboard.appFunctions', {
        url: '/app?appName&anonymousToken',
        component: 'appFunctions',
        data: {
          requiresLogin: true,
          title: 'Functions'
        }
      })
      .state('dashboard.parameters', {
        url: '/functions/:function_id/parameters',
        component: 'appParams',
        data: {
          requiresLogin: true,
          title: 'Parameters'
        }
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
