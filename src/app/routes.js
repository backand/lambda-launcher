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
    
    $urlRouterProvider.when('/:app', '/:app/login');
    $stateProvider
      .state('login', {
        url: '/:app/login?error&t',
        component: 'signin',
        data: {
          title: 'Login'
        }
      })
      .state('dashboard', {
        absolute: true,
        url: '/:app',
        data: {
          requiresLogin: true
        },
        template: '<ui-view></ui-view>'
      })
      .state('dashboard.appFunctions', {
        url: '/functions?t',
        component: 'appFunctions',
        data: {
          requiresLogin: true,
          title: 'Launch Functions'
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

    $urlRouterProvider.otherwise('/');
  }

})();
