/**
 * @ngdoc Component
 * @name LambdaLauncher.component.parameters
 *
 * @module LambdaLauncher
 *
 * @description
 * parameters component - A component to configure settings of an application
 *
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('LambdaLauncher')
    .component('parameters', {
      templateUrl: 'app/components/functions/parameters/parameters.html',
      bindings: {
        function: '<'
      },
      controller: [
        '$log',
        '$stateParams',
        'Lambda',
        '$state',
        'toaster',
        '_',
        function ($log, $stateParams, Lambda, $state, toaster, _) {
          var $ctrl = this, function_id;

          /**
           * component's lifeCycle hooks
           */
          $ctrl.$onInit = initialization;
          $ctrl.$onChanges = onChanges;

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
            function_id = $ctrl.function.iD
            if (!function_id) {
              throw Error('function_id not found');
            }
            if (!Lambda.isParamsUpdated(function_id)) {
              Lambda.setParamsUpdated(function_id);
            }
            $ctrl.parameters = Lambda.getParameters(function_id);
          }

          function onChanges(bindings) {
            if (!bindings.function.isFirstChange()) {
            }

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
