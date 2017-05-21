/**
 * @ngdoc Component
 * @name LambdaLauncher.component.appParams
 *
 * @module LambdaLauncher
 *
 * @description
 * appParams component - A component to configure settings of an application
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('appParams', {
      templateUrl: 'app/components/appParams/appParams.html',
      controller: [
        '$log',
        '$stateParams',
        'Lambda',
        '$state',
        'toaster',
        function ($log, $stateParams, Lambda, $state, toaster) {
          var $ctrl = this, function_id;
          function_id = $stateParams.function_id;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;

          /**
           * public methods
           */
          $ctrl.updateParameters = updateParameters;
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
            if (!function_id) {
              throw Error('function_id not found');
            }
            $ctrl.parameters = Lambda.getParameters(function_id);
          }
          /**
           * @function updateParameters
           * @description update parameters value
           * 
           * @returns void
           */
          function updateParameters() {
            var params = angular.copy($ctrl.parameters);
            Lambda
              .saveParameters(function_id, params)
              .then(function () {
                toaster.success('Success', 'Parameters have been updated successfully.');
                $state.go('dashboard.appFunctions');
                $log.info('Parameters updated.');
              });
          }

        }]
    })
})();
