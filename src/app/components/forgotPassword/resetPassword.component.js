/**
 * @ngdoc Component
 * @name LambdaLauncher.component.resetPassword
 *
 * @module LambdaLauncher
 *
 * @description
 * resetPassword component - A componet to reset password
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('resetPassword', {
      templateUrl: 'app/components/forgotPassword/resetPassword.html',
      controller: [
        'Backand',
        '$log',
        'blockUI',
        'toaster',
        '$stateParams',
        '$state',
        function (Backand, $log, blockUI, toaster, $stateParams, $state) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.resetPassword = resetPassword;
          /**
           * public properties
           */
          $ctrl.error = '';
          /**
            * @function
            * @name initialization
            * @description
            * A component's lifeCycle hook which is called after all the controllers on an element have
            * been constructed and had their bindings initialized
            */
          function initialization() {
          }

          function resetPassword() {
            blockUI.start();
            Backand
              .resetPassword($ctrl.user.password,$stateParams.token)
              .then(function (response) {
                $log.info(response);
                blockUI.stop();
                 toaster.success('Password changed');
                 $state.go('login');
              }, function (error) {
                $ctrl.error = error.data;
                $log.error(error);
                blockUI.stop();
              });
          }

        }]
    });
})();
