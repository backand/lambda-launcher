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

    $urlRouterProvider.when('/{app:[0-9a-zA-Z]{1,}}', '/{app:[0-9a-zA-Z]{1,}}/functions');
    $stateProvider
      .state('login', {
        url: '/:app/login?err&t',
        component: 'signin',
        data: {
          title: 'Login'
        }
      })
      .state('default', {
        url: '/',
        component: 'default',
        data: {
          title: 'Home Page'
        }
      })
       .state('reset-password', {
        url: '/:app/reset-password?token',
        component: 'resetPassword',
        data: {
          title: 'Reset Password'
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
            component: 'functionDetail'
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
