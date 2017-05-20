/**
 * @ngdoc Component
 * @name LambdaLauncher.component.signin
 *
 * @module LambdaLauncher
 *
 * @description
 * signin component - A application landing page
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('signin', {
      templateUrl: 'app/components/signin/signin.html',
      controller: [
        '$log',
        '$state',
        '$uibModal',
        'Auth',
        'ENV_CONFIG',
        'blockUI',
        '$injector',
        function ($log, $state, $uibModal, Auth, ENV_CONFIG, blockUI, $injector) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.socialSignin = socialSignin;
          $ctrl.signin = signin;
          $ctrl.forgotPassword = forgotPassword;
          /**
           * public properties
           */
          $ctrl.isSigning = false;
          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
            $ctrl.error = $injector.get('$stateParams').error ? $base64.decode($injector.get('$stateParams').error) : '' ;
            getSocialProviders();
          }

          function getSocialProviders() {
            blockUI.start();
            Auth
              .getSocialProviders()
              .then(function (response) {
                $ctrl.socialProviders = response;
                blockUI.stop();
                $log.log('Social Provider collection', response);
              }, function (error) {
                //handle error
                blockUI.stop();
                $log.error(error);
              });
          }

          function socialSignin(provider) {
            $ctrl.isSigning = true;
            blockUI.start();
            Auth
              .socialSignin(provider)
              .then(function () {
                blockUI.stop();
                $state.go(ENV_CONFIG.ROUTE_HOME_STATE);
              }, function (error) {
                //handle error
                blockUI.stop();
                $log.error(error);
                $ctrl.isSigning = false;
              });
          }

          function signin() {
            blockUI.start;
            Auth
              .signin($ctrl.user)
              .then(function (response) {
                blockUI.stop();
                $log.info(response);
              }, function (error) {
                blockUI.stop();
                $log.error(error);
              });
          }

          function forgotPassword() {
            $uibModal.open({
              component: 'requestResetPassword',
              backdrop: 'static',
              resolve: {
              }
            });
          }

        }]
    });
})();
