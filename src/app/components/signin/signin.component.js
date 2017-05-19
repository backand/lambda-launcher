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
        function ($log, $state, $uibModal, Auth, ENV_CONFIG) {
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
            getSocialProviders();
          }

          function getSocialProviders() {
            Auth
              .getSocialProviders()
              .then(function (response) {
                $ctrl.socialProviders = response;
                $log.log('Social Provider collection', response);
              }, function (error) {
                //handle error
                $log.error(error);
              });
          }

          function socialSignin(provider) {
            $ctrl.isSigning = true;
            Auth
              .socialSignin(provider)
              .then(function () {
                $state.go(ENV_CONFIG.ROUTE_HOME_STATE);
              }, function (error) {
                //handle error
                $log.error(error);
                $ctrl.isSigning = false;
              });
          }

          function signin() {
            Auth
              .signin($ctrl.user)
              .then(function (response) {
                $log.info(response);
              }, function (error) {
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
