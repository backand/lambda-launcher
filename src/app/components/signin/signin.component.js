/**
 * @ngdoc Component
 * @name LambdaLauncher.component.signin
 * @module LambdaLauncher
 *
 * @description
 * signin component - A application landing page
 * @requires $log, $state, $uibModal, Auth, ENV_CONFIG, blockUI, $injector
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
        'toaster',
        function ($log, $state, $uibModal, Auth, ENV_CONFIG, blockUI, $injector, toaster) {
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
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function  initialization() {
            $ctrl.appName = $state.params.app;
            $ctrl.error = $injector.get('$stateParams').error ? $base64.decode($injector.get('$stateParams').error) : '';
            getSocialProviders();
          }

          /**
           * @name getSocialProviders
           * @description fetch enabled social providers from backand
           * @returns void
           */
          function getSocialProviders() {
            blockUI.start();
            Auth
              .getSocialProviders()
              .then(function (response) {
                $ctrl.socialProviders = response.data;
                blockUI.stop();
                $log.log('Social Provider collection', response.data);
              }, function (error) {
                //handle error
                blockUI.stop();
                $log.error(error);
              });
          }

          /**
           * @name socialSignin
           * @description signin with social providers[facebook,github ...]
           * @param {string} provider A name of social provider[facebook,github ...]
           * @returns void
           */
          function socialSignin(provider) {
            $ctrl.isSigning = true;
            blockUI.start();
            Auth
              .socialSignin(provider)
              .then(function () {
                blockUI.stop();
                $state.go(ENV_CONFIG.ROUTE_HOME_STATE, {app: $state.params.app});
              }, function (error) {
                //handle error
                blockUI.stop();
                $log.error(error);
                 toaster.error(error.data.error_description);
                $ctrl.isSigning = false;
              });
          }

          /**
           * @name signin
           * @description signin with credentails[username,password]
           * @requires $ctrl.user which contains [username,password]
           * @returns void
           */
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
                toaster.error(error.data.error_description);
              });
          }

          /**
           * @name forgotPassword
           * @description opens Twitter Bootstrap modal
           * @returns void
           */
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
