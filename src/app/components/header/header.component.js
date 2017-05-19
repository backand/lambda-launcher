/**
 * @ngdoc Component
 * @name LambdaLauncher.component.header
 *
 * @module LambdaLauncher
 *
 * @description
 * header component - A application header
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('appHeader', {
      templateUrl: 'app/components/header/header.html',
      bindings: {
        isAuthenticated: '<'
      },
      controller: [
        '$log',
        'Auth',
        'App',
        'ENV_CONFIG',
        '$state',
        function ($log, Auth, App, ENV_CONFIG, $state) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.logout = logout;
          $ctrl.back = back;
          /**
           * public properties
           */
          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            $log.info('header component initialized');
            $ctrl.App = App;
          }

          function logout() {
            Auth.logout().then(function () {
              $state.go(ENV_CONFIG.ROUTE_LOGIN_STATE);
            });
            $log.info('logout called');
          }

          function back() {
            $log.info(App.lastState);
            var to, toParams = {};
            to = App.lastState.from;
            toParams = App.lastState.fromParams;
            if (to.name === '') {
              to = 'dashboard.appFunctions';
              toParams = {};
            } else if (to.name === ENV_CONFIG.ROUTE_LOGIN_STATE && App.isAuthenticated) {
              return;
            }
            $state.go(to, toParams);
          }

          //end of controller
        }]
    })
})();
