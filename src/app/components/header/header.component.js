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
        'blockUI',
        function ($log, Auth, App, ENV_CONFIG, $state,blockUI) {
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
            $ctrl.isLoggedIn = Auth.isLoggedIn;
            $ctrl.currentUser = Auth.currentUser;
          }

          function logout($event) {
            $event.preventDefault();
            blockUI.start();
            Auth.logout().then(function () {
              blockUI.stop();
              $state.go(ENV_CONFIG.ROUTE_LOGIN_STATE, {}, { reload: true });
            }, function (error) {
               blockUI.stop();
              $state.go(ENV_CONFIG.ROUTE_LOGIN_STATE, {}, { reload: true });
            });
            $log.info('logout called');
          }

          function back() {
            $log.info(App.state);
            var to, toParams = {};
            to = App.state.from;
            toParams = App.state.fromParams;
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
