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
        'blockUI',
        '$rootScope',
        '$scope',
        function ($log, $stateParams, Lambda, $state, toaster, _, blockUI, $rootScope, $scope) {
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
            $ctrl.parameters = angular.copy(Lambda.getParameters(function_id));
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
            if ($ctrl.saveParams) {
              saveParams();
            }
            launchFunction($ctrl.function, $ctrl.parameters);
            $ctrl.parameters = angular.copy(Lambda.getParameters(function_id));
          }

          function saveParams() {
            var params = angular.copy($ctrl.parameters);
            Lambda
              .saveParameters(function_id, params)
              .then(function () {
                $ctrl.form.$setPristine();
                toaster.success('Success', 'Parameters have been updated successfully.');
                $log.info('Parameters updated.');
              });
          }

          function launchFunction(func, params) {
            var funcId = func.iD, parameters;

            if (params) {
              parameters = params;
            } else {
              parameters = Lambda
                .getParameters(funcId);
            }

            var params = {};
            _.forEach(parameters, function (p) {
              params[p.name.trim()] = encodeURIComponent(p.value);
            });
            blockUI.start();
            Lambda
              .runFunction(func.name, params)
              .then(function (response) {
                saveRun(funcId, {
                  Payload: response.data,
                  StatusCode: response.status
                });
                toaster.success('Success', 'Function has been executed successfully.');
                $log.info('Function run successful', response);
                blockUI.stop();
              }, function (error) {
                toaster.error('Error', 'Error occurred while executing function.');
                $log.error('Function run error', error);
                saveRun(funcId, {
                  Payload: error.data.errorMessage || error.data,
                  StatusCode: error.status
                });
                blockUI.stop();
              });
          }

          function saveRun(funcId, resultSet) {
            $log.info(resultSet);
            var runInstance = angular.copy(resultSet);
            runInstance.executionTime = _.now();
            Lambda.saveRun(funcId, runInstance);
          }

          var LambdaLauncherEvent = $rootScope.$on('EVENT:LAUNCH_FUNCTION', function (e, d) {
            if (d.function.iD == $ctrl.function.iD) {
              updateParameters();
            }
          });
          $scope.$on('$destroy', function () {
            LambdaLauncherEvent();
          });

          //end of controller
        }]
    })
})();
