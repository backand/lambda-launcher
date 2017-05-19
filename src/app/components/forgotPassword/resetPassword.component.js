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
        function (Backand, $log) {
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
            Backand
              .resetPassword({
                newPassword: 'newPassword',
                resetToken: 'resetToken'
              })
              .then(function (response) {
                $log.info(response);
              }, function (error) {
                $log.error(error);
              });
          }

        }]
    });
})();
