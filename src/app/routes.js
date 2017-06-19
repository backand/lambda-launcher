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

    $urlRouterProvider.when('/:app', '/:app/functions');
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
        component: 'functions',
        data: {
          requiresLogin: true,
          title: 'Launch Functions'
        }
      }).state('dashboard.appFunctions.detail', {
        url: '/:function_id',
        views: {
          'function-detail': {
            component: 'functionDetail',
          }
        },
        data: {
          requiresLogin: true,
          title: 'Launch Functions'
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
