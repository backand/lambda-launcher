/**
 * @ngdoc Component
 * @name LambdaLauncher.component.requestResetPassword
 *
 * @module LambdaLauncher
 *
 * @description
 * requestResetPassword component - A componet to request reset password
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('requestResetPassword', {
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      templateUrl: 'app/components/forgotPassword/requestResetPassword.html',
      controller: [
        'Backand',
        '$log',
        '$state',
        '_',
        'toaster',
        function (Backand, $log, $state, _, toaster) {
          var $ctrl = this;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.requestResetPassword = requestResetPassword;
          $ctrl.cancel = cancelModal;
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

          function requestResetPassword() {
            Backand
              .requestResetPassword($ctrl.user)
              .then(function (response) {
                $log.info(response);
              }, function (error) {
                $log.error(error);
                toaster.pop('error', "Error", error.data);
              });
          }

          function cancelModal() {
            $ctrl.dismiss({ $value: 'cancel' });
          }

          function closeModal() {
            $ctrl.close({ $value: 'closed' });
          }


        }]
    });
})();
